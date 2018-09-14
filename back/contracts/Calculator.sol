pragma solidity ^0.4.23;

contract Calculator {
    struct Token {
        bytes1 kind;
        int val;
    }

    function eval(string input) public pure returns (int) {
        bytes memory str = bytes(input);
        Token[] memory tokens;
        uint count;

        (tokens, count) = tokenize(str);

        if (count > 0) {
            (tokens, count) = toPostfix(tokens, count);
            return calculateRPN(tokens, count);
        }

        return 0;
    }

    function tokenize(bytes memory str) internal pure returns (Token[] memory tokens, uint count) {
        tokens = new Token[](str.length);
        count = 0;
        uint start = 0;

        for (uint i = 0; i < str.length; i++) {
            bytes1 c = str[i];
            if (c == "-") {
                if (i + 1 >= str.length) {
                    revert("invalid input");
                }
                if (str[i + 1] >= 48 && str[i + 1] <= 57) {
                    continue;
                }
            }
            if (c >= 48 && c <= 57) { // digits
                continue;
            }
            if (c == "+" || c == "-" || c == "*" || c == "/" || c == "(" || c == ")") {
                if (start != i) {
                    tokens[count++] = Token(0, parseInt(str, start, i));
                }
                tokens[count++] = Token(c, 0);
                start = i + 1;
            } else if (c == 32) { // space
                if (start != i) {
                    tokens[count++] = Token(0, parseInt(str, start, i));
                }
                start = i + 1;
            } else {
                revert("unexpected char");
            }
        }
        if (start != str.length) {
            tokens[count++] = Token(0, parseInt(str, start, str.length));
        }

        return (tokens, count);
    }

    // ShuntingYard algorithm
    function toPostfix(Token[] tokens, uint count) internal pure returns (Token[], uint) {
        Token[] memory stack = new Token[](count);
        Token[] memory output = new Token[](count);
        uint stackSize = 0;
        uint outputSize = 0;
        Token memory tok;

        for (uint i = 0; i < count; i++) {
            tok = tokens[i];
            if (tok.kind == 0) {
                output[outputSize++] = tok;
            } else if (isOperator(tok.kind)) {
                bool rightAssociative = isRightAssociative(tok.kind);
                while (stackSize > 0) {
                    Token memory op2 = stack[stackSize - 1];
                    if (!isOperator(op2.kind)) {
                        break;
                    }
                    int c = precedence(tok.kind) - precedence(op2.kind);
                    if (c < 0 || (!rightAssociative && c <= 0)) {
                        op2 = stack[--stackSize];
                        output[outputSize++] = op2;
                    } else {
                        break;
                    }
                }
                stack[stackSize++] = tok;
            } else if (tok.kind == "(") {
                stack[stackSize++] = tok;
            } else if (tok.kind == ")") {
                while (stackSize > 0) {
                    tok = stack[--stackSize];
                    if (tok.kind == "(") {
                        break;
                    }
                    output[outputSize++] = tok;
                }
                if (tok.kind != "(") {
                    revert("no matching left parenthesis.");
                }
            }
        }

        while (stackSize > 0) {
            tok = stack[--stackSize];
            if (!isOperator(tok.kind)) {
                revert("no matching right parenthesis");
            }
            output[outputSize++] = tok;
        }

        return (output, outputSize);
    }

    function isOperator(bytes1 c) internal pure returns (bool) {
        return c == "+" || c == "-" || c == "*" || c == "/";
    }

    function isRightAssociative(bytes1 c) internal pure returns (bool) {
        return c == "^";
    }

    function precedence(bytes1 c) internal pure returns (int) {
        if (c == "*" || c == "/") {
            return 3;
        }
        return 2;
    }

    function calculateRPN(Token[] memory tokens, uint count) internal pure returns (int) {
        int[] memory stack = new int[](count);
        uint stackSize = 0;
        int a;
        int b;

        for (uint i = 0; i < count; i++) {
            Token memory tok = tokens[i];

            if (tok.kind == 0) {
                stack[stackSize++] = tok.val;
                continue;
            } 

            if (stackSize == 0) {
                revert("stack is empty");
            }
            b = stack[--stackSize];

            if (stackSize == 0) {
                revert("stack is empty");
            }
            a = stack[--stackSize];

            if (tok.kind == "+") {
                stack[stackSize++] = a + b;
            } else if (tok.kind == "-") {
                stack[stackSize++] = a - b;
            } else if (tok.kind == "*") {
                stack[stackSize++] = a * b;
            } else if (tok.kind == "/") {
                stack[stackSize++] = a / b;
            } else {
                revert("operation is not supported");
            }
        }

        if (stackSize == 0) {
            revert("stack is empty");
        }

        return stack[stackSize - 1];
    }

    // adopted from oraclize utils   
    function parseInt(bytes str, uint start, uint end) internal pure returns (int) {
        int mint = 0;
        bool negative = false;
        for (uint i = start; i < end; i++) {
            bytes1 c = str[i];
            if (c == "-") {
                negative = true;
                continue;
            }
            if (c >= 48 && c <= 57) {
                mint *= 10;
                mint += int(str[i]) - 48;
            } else {
                revert("unexpected char");
            }
        }
        if (negative) {
            mint *= -1;
        }
        return mint;
    }
}
