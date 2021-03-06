///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Coordinators", () => {
  describe("ScaleDomainCoordinator", () => {
    it("domains are coordinated", () => {
      var s1 = new Plottable.Scale.Linear();
      var s2 = new Plottable.Scale.Linear();
      var s3 = new Plottable.Scale.Linear();
      var coordinator = new Plottable._Util.ScaleDomainCoordinator([s1, s2, s3]);

      // HACKHACK: #1893 ScaleDomainCoordinator should not do so much magic on construction
      assert.isNotNull(coordinator, "proper coordination is set up");

      s1.domain([0, 100]);
      assert.deepEqual(s1.domain(), [0, 100]);
      assert.deepEqual(s1.domain(), s2.domain());
      assert.deepEqual(s1.domain(), s3.domain());

      s1.domain([-100, 5000]);
      assert.deepEqual(s1.domain(), [-100, 5000]);
      assert.deepEqual(s1.domain(), s2.domain());
      assert.deepEqual(s1.domain(), s3.domain());
    });
  });
});
