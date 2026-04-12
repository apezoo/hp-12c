/**
 * Financial Engine Core Tests
 * Tests for basic engine functionality, state management, and utility methods
 */

const { createFinancialEngine } = require('./test-helpers');

describe('Financial Engine - Basic Operations', () => {
    test('Create new FinancialEngine instance', () => {
        const fin = createFinancialEngine();
        expect(fin).toBeDefined();
        expect(fin.n).toBe(0);
        expect(fin.i).toBe(0);
        expect(fin.pv).toBe(0);
        expect(fin.pmt).toBe(0);
        expect(fin.fv).toBe(0);
    });

    test('Store and recall TVM variables', () => {
        const fin = createFinancialEngine();
        
        fin.store('n', 12);
        fin.store('i', 5);
        fin.store('pv', -1000);
        fin.store('pmt', -100);
        fin.store('fv', 2000);
        
        expect(fin.recall('n')).toBe(12);
        expect(fin.recall('i')).toBe(5);
        expect(fin.recall('pv')).toBe(-1000);
        expect(fin.recall('pmt')).toBe(-100);
        expect(fin.recall('fv')).toBe(2000);
    });

    test('Store with case-insensitive variable names', () => {
        const fin = createFinancialEngine();
        
        fin.store('N', 10);
        fin.store('I', 5);
        fin.store('PV', 1000);
        
        expect(fin.recall('n')).toBe(10);
        expect(fin.recall('i')).toBe(5);
        expect(fin.recall('pv')).toBe(1000);
    });

    test('Recall unknown variable returns 0', () => {
        const fin = createFinancialEngine();
        expect(fin.recall('unknown')).toBe(0);
    });
});

describe('Financial Engine - BEGIN/END Mode', () => {
    test('Default mode is END (false)', () => {
        const fin = createFinancialEngine();
        expect(fin.getBeginMode()).toBe(false);
    });

    test('Set BEGIN mode', () => {
        const fin = createFinancialEngine();
        fin.setBeginMode(true);
        expect(fin.getBeginMode()).toBe(true);
    });

    test('Set END mode explicitly', () => {
        const fin = createFinancialEngine();
        fin.setBeginMode(true);
        fin.setBeginMode(false);
        expect(fin.getBeginMode()).toBe(false);
    });

    test('BEGIN mode affects payment calculations', () => {
        const finEnd = createFinancialEngine();
        finEnd.setBeginMode(false);
        finEnd.pv = 10000;
        finEnd.i = 5;
        finEnd.n = 10;
        finEnd.fv = 0;
        const pmtEnd = finEnd.solvePMT();

        const finBegin = createFinancialEngine();
        finBegin.setBeginMode(true);
        finBegin.pv = 10000;
        finBegin.i = 5;
        finBegin.n = 10;
        finBegin.fv = 0;
        const pmtBegin = finBegin.solvePMT();

        expect(pmtEnd).not.toBe(pmtBegin);
        expect(Math.abs(pmtBegin)).toBeLessThan(Math.abs(pmtEnd));
    });
});

describe('Financial Engine - State Management', () => {
    test('Get state returns all TVM variables', () => {
        const fin = createFinancialEngine();
        fin.n = 12;
        fin.i = 5;
        fin.pv = -1000;
        fin.pmt = -100;
        fin.fv = 2000;
        fin.setBeginMode(true);
        
        const state = fin.getState();
        
        expect(state.n).toBe(12);
        expect(state.i).toBe(5);
        expect(state.pv).toBe(-1000);
        expect(state.pmt).toBe(-100);
        expect(state.fv).toBe(2000);
        expect(state.beginMode).toBe(true);
        expect(state.cashFlows).toEqual([]);
    });

    test('Set state restores TVM variables', () => {
        const fin = createFinancialEngine();
        
        const state = {
            n: 24,
            i: 6,
            pv: -5000,
            pmt: -200,
            fv: 0,
            beginMode: true,
            cashFlows: [-1000, 500, 600]
        };
        
        fin.setState(state);
        
        expect(fin.n).toBe(24);
        expect(fin.i).toBe(6);
        expect(fin.pv).toBe(-5000);
        expect(fin.pmt).toBe(-200);
        expect(fin.fv).toBe(0);
        expect(fin.getBeginMode()).toBe(true);
        expect(fin.cashFlows).toEqual([-1000, 500, 600]);
    });

    test('Set state with partial data', () => {
        const fin = createFinancialEngine();
        fin.n = 10;
        fin.i = 5;
        
        fin.setState({ pv: -1000, fv: 2000 });
        
        // Unspecified values should be reset to 0
        expect(fin.n).toBe(0);
        expect(fin.i).toBe(0);
        expect(fin.pv).toBe(-1000);
        expect(fin.fv).toBe(2000);
    });

    test('Set state with null/undefined handles gracefully', () => {
        const fin = createFinancialEngine();
        fin.n = 10;
        
        fin.setState(null);
        
        // Should not throw error
        expect(fin.n).toBe(10);
    });
});

describe('Financial Engine - Clear Operations', () => {
    test('Clear all financial registers', () => {
        const fin = createFinancialEngine();
        fin.n = 12;
        fin.i = 5;
        fin.pv = -1000;
        fin.pmt = -100;
        fin.fv = 2000;
        fin.addCashFlow(-5000);
        fin.addCashFlow(1500);
        
        fin.clear();
        
        expect(fin.n).toBe(0);
        expect(fin.i).toBe(0);
        expect(fin.pv).toBe(0);
        expect(fin.pmt).toBe(0);
        expect(fin.fv).toBe(0);
        expect(fin.cashFlows).toEqual([]);
    });

    test('Clear preserves BEGIN/END mode', () => {
        const fin = createFinancialEngine();
        fin.setBeginMode(true);
        fin.n = 10;
        
        fin.clear();
        
        // BEGIN mode should be preserved (this is how HP-12C works)
        expect(fin.getBeginMode()).toBe(true);
    });

    test('Clear cash flows independently', () => {
        const fin = createFinancialEngine();
        fin.n = 12;
        fin.addCashFlow(-1000);
        fin.addCashFlow(500);
        
        fin.clearCashFlows();
        
        expect(fin.cashFlows).toEqual([]);
        expect(fin.n).toBe(12); // TVM values should be preserved
    });
});

describe('Financial Engine - Constants', () => {
    test('MAX_ITERATIONS is defined', () => {
        const fin = createFinancialEngine();
        expect(fin.MAX_ITERATIONS).toBeDefined();
        expect(fin.MAX_ITERATIONS).toBeGreaterThan(0);
    });

    test('PRECISION is defined', () => {
        const fin = createFinancialEngine();
        expect(fin.PRECISION).toBeDefined();
        expect(fin.PRECISION).toBeLessThan(1);
        expect(fin.PRECISION).toBeGreaterThan(0);
    });
});
