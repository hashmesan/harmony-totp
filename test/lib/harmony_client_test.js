
const HarmonyClient = require("../../lib/harmony_client");

describe("Library test", (accounts) => {
  it("checks for name available", async () => {
    var client = new HarmonyClient("https://api.s3.b.hmny.io", "0x4fb1C434101ced0773a3bc77D541B3465023639f");
    var available = await client.isNameAvailable("hashmesan000.crazy.one", 31536000);
    console.log("Available?", available);
    return true;
  });
});
