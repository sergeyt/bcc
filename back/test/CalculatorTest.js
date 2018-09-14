const Calculator = artifacts.require("Calculator");

const errTypes = {
    revert: 'revert',
    outOfGas: 'out of gas',
    invalidJump: 'invalid JUMP',
    invalidOpcode: 'invalid opcode',
    stackOverflow: 'stack overflow',
    stackUnderflow: 'stack underflow',
    staticStateChange: 'static state change',
}

const tryCatch = async (promise, errType = errTypes.revert) => {
    const PREFIX = 'VM Exception while processing transaction: ';
    try {
        await promise;
        throw null;
    } catch (error) {
        assert(error, 'Expected an error but did not get one');
        assert(error.message.startsWith(PREFIX + errType), "Expected an error starting with '" + PREFIX + errType + "' but got '" + error.message + "' instead");
    }
};

contract("Calculator", accounts => {
    let calc;

    beforeEach(async () => {
        calc = await Calculator.new();
    });

    it('positive cases', async () => {
        const result = await calc.eval('(1 + 2) * 3');
        assert.equal(result, 9);
    });

    it('negative cases', async () => {
        await tryCatch(calc.eval('-'));
        await tryCatch(calc.eval('1+-'));
        await tryCatch(calc.eval('abc'));
        await tryCatch(calc.eval('(1+2'));
        await tryCatch(calc.eval('1+2)'));
    });
});
