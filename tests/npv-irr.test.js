/**
 * NPV and IRR Tests
 * Tests for Net Present Value and Internal Rate of Return calculations
 */

const { setupCashFlows, createFinancialEngine } = require('./test-helpers');

describe('NPV - Net Present Value', () => {
    test('NPV - Simple Cash Flow: CF0=-1000, CF1=1200 at 10%', () => {
        const fin = setupCashFlows([-1000, 1200]);
        const result = fin.calculateNPV(10);
        // Expected: -1000 + 1200/1.10 = 90.91
        expect(result).toBeCloseTo(90.91, 0.5);
    });

    test('NPV - Multiple Cash Flows: CF0=-5000, CF1=1500, CF2=2000, CF3=2500 at 8%', () => {
        const fin = setupCashFlows([-5000, 1500, 2000, 2500]);
        const result = fin.calculateNPV(8);
        // Expected: ~350
        expect(result).toBeCloseTo(350, 10);
    });

    test('NPV - Negative NPV Project', () => {
        const fin = setupCashFlows([-10000, 2000, 2000, 2000, 2000]);
        const result = fin.calculateNPV(15);
        // At 15% discount rate, this should have negative NPV
        expect(result).toBeLessThan(0);
    });

    test('NPV - Positive NPV Project', () => {
        const fin = setupCashFlows([-5000, 2000, 2000, 2000, 2000]);
        const result = fin.calculateNPV(10);
        // At 10% discount rate, this should have positive NPV
        expect(result).toBeGreaterThan(0);
    });

    test('NPV - Zero Discount Rate', () => {
        const fin = setupCashFlows([-1000, 500, 500, 500]);
        const result = fin.calculateNPV(0);
        // At 0% discount, NPV is just the sum
        expect(result).toBeCloseTo(500, 0.01);
    });

    test('NPV - Empty Cash Flows', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateNPV(10);
        expect(result).toBe(0);
    });

    test('NPV - Single Cash Flow (CF0 only)', () => {
        const fin = setupCashFlows([-5000]);
        const result = fin.calculateNPV(10);
        expect(result).toBeCloseTo(-5000, 0.01);
    });
});

describe('IRR - Internal Rate of Return', () => {
    test('IRR - Simple Investment: CF0=-1000, CF1=1100', () => {
        const fin = setupCashFlows([-1000, 1100]);
        const result = fin.calculateIRR();
        // Expected: 10% (1100/1000 - 1)
        expect(result).toBeCloseTo(10, 0.1);
    });

    test('IRR - Multiple Years Investment: CF0=-1000, CF1=500, CF2=600', () => {
        const fin = setupCashFlows([-1000, 500, 600]);
        const result = fin.calculateIRR();
        // Should be around 13-14%
        expect(result).toBeBetween(13, 14);
    });

    test('IRR - Real Estate Investment', () => {
        // Investment: -$100,000 upfront, +$15,000/year for 10 years, +$50,000 final sale
        const cashFlows = [-100000];
        for (let i = 0; i < 9; i++) {
            cashFlows.push(15000);
        }
        cashFlows.push(65000); // Final year: rent + sale
        
        const fin = setupCashFlows(cashFlows);
        const result = fin.calculateIRR();
        // Should be around 12-14%
        expect(result).toBeBetween(11, 15);
    });

    test('IRR - Break-even Project', () => {
        const fin = setupCashFlows([-1000, 250, 250, 250, 250]);
        const result = fin.calculateIRR();
        // IRR should be close to 0% (break-even)
        expect(result).toBeCloseTo(0, 2);
    });

    test('IRR - High Return Investment', () => {
        const fin = setupCashFlows([-1000, 0, 0, 5000]);
        const result = fin.calculateIRR();
        // Should be a high positive return
        expect(result).toBeGreaterThan(50);
    });

    test('IRR - Should throw error for insufficient cash flows', () => {
        const fin = setupCashFlows([-1000]);
        expect(() => fin.calculateIRR()).toThrow('Need at least 2 cash flows');
    });
});

describe('NPV & IRR - Integration Tests', () => {
    test('IRR should make NPV equal to zero', () => {
        const cashFlows = [-5000, 1500, 2000, 2500];
        
        const fin1 = setupCashFlows(cashFlows);
        const irr = fin1.calculateIRR();
        
        const fin2 = setupCashFlows(cashFlows);
        const npv = fin2.calculateNPV(irr);
        
        // NPV at IRR should be very close to 0
        expect(npv).toBeCloseTo(0, 1);
    });

    test('NPV should decrease as discount rate increases', () => {
        const cashFlows = [-1000, 500, 500, 500];
        
        const fin1 = setupCashFlows(cashFlows);
        const npv5 = fin1.calculateNPV(5);
        
        const fin2 = setupCashFlows(cashFlows);
        const npv10 = fin2.calculateNPV(10);
        
        const fin3 = setupCashFlows(cashFlows);
        const npv15 = fin3.calculateNPV(15);
        
        expect(npv5).toBeGreaterThan(npv10);
        expect(npv10).toBeGreaterThan(npv15);
    });
});

describe('Cash Flow Management', () => {
    test('Add and clear cash flows', () => {
        const fin = createFinancialEngine();
        fin.addCashFlow(-1000);
        fin.addCashFlow(500);
        fin.addCashFlow(600);
        
        const state = fin.getState();
        expect(state.cashFlows.length).toBe(3);
        
        fin.clearCashFlows();
        const newState = fin.getState();
        expect(newState.cashFlows.length).toBe(0);
    });

    test('Cash flows preserved in state', () => {
        const fin = createFinancialEngine();
        fin.addCashFlow(-1000);
        fin.addCashFlow(1100);
        
        const state = fin.getState();
        expect(state.cashFlows).toEqual([-1000, 1100]);
    });
});

describe('NPV/IRR - Real-World Business Cases', () => {
    test('Software Startup Investment', () => {
        // Year 0: -$500K investment
        // Years 1-2: -$100K operating losses
        // Years 3-5: +$200K, +$350K, +$500K profits
        const fin = setupCashFlows([-500000, -100000, -100000, 200000, 350000, 500000]);
        const irr = fin.calculateIRR();
        
        // Should have a positive IRR but not too high given the losses
        expect(irr).toBeBetween(10, 30);
    });

    test('Equipment Purchase Decision', () => {
        // Machine costs $50K, saves $15K/year for 5 years, salvage value $5K
        const cashFlows = [-50000, 15000, 15000, 15000, 15000, 20000];
        
        const fin1 = setupCashFlows(cashFlows);
        const npv = fin1.calculateNPV(12); // 12% hurdle rate
        
        const fin2 = setupCashFlows(cashFlows);
        const irr = fin2.calculateIRR();
        
        // NPV should be positive at 12%
        expect(npv).toBeGreaterThan(0);
        // IRR should exceed 12%
        expect(irr).toBeGreaterThan(12);
    });

    test('Bond Investment', () => {
        // $1000 bond, 5% coupon for 3 years, return principal at end
        const fin = setupCashFlows([-1000, 50, 50, 1050]);
        const irr = fin.calculateIRR();
        
        // IRR should be close to 5% (the coupon rate)
        expect(irr).toBeCloseTo(5, 0.5);
    });
});
