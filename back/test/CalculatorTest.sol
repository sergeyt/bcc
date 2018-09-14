pragma solidity ^0.4.0;

import "truffle/Assert.sol";
import "../contracts/Calculator.sol";

contract CalculatorTest {
    function testCalculator() {
        int result;
        Calculator calc = new Calculator();

        result = calc.eval("");
        Assert.equal(result, 0, "result must be 0");

        result = calc.eval("(1 + 2) * 3");
        Assert.equal(result, 9, "result must be 9");

        result = calc.eval("1 + 2 * 3");
        Assert.equal(result, 7, "result must be 7");
    }
}
