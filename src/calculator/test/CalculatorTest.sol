pragma solidity ^0.4.0;

import "truffle/Assert.sol";
import "../contracts/Calculator.sol";

contract CalculatorTest {
    function testCalculator() public {
        int result;
        Calculator calc = new Calculator();

        result = calc.eval("");
        Assert.equal(result, 0, "result must be 0");

        result = calc.eval("(1 + 2) * 3");
        Assert.equal(result, 9, "result must be 9");

        result = calc.eval("1 + 2 * 3");
        Assert.equal(result, 7, "result must be 7");

        result = calc.eval("1 + - 2 * 3");
        Assert.equal(result, -5, "result must be -5");

        result = calc.eval("1 - 2");
        Assert.equal(result, -1, "result must be -1");

        result = calc.eval("1 - 2 * 3");
        Assert.equal(result, -5, "result must be -5");
    }
}
