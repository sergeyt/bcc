pragma solidity ^0.4.0;

import "truffle/Assert.sol";
import "../contracts/Calculator.sol";

contract CalculatorTest {
    function testTokenize() {
        Calculator calc = new Calculator();
        string memory result = calc.tokenizeString("(1 + 2) * 3");
        Assert.equal(result, "( 1 + 2 ) * 3", "ok");
    }

    function testPostfix() {
        Calculator calc = new Calculator();
        string memory result = calc.toPostfixString("(1 + 2) * 3");
        Assert.equal(result, "1 2 + 3 *", "ok");
    }

    function testCalculator() {
        Calculator calc = new Calculator();
        int result = calc.eval("(1 + 2) * 3");
        Assert.equal(result, 9, "9");
    }
}
