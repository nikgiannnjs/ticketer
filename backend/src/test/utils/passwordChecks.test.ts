import { describe, it, expect } from "vitest";
import { validPasswordCheck } from "@/utils/validPasswordCheck";
import bcrypt from "bcrypt";

describe("passwordChecks", async () => {
  describe("validPasswordCheck", () => {
    it("should return true for a valid password format", async () => {
      const pw = await validPasswordCheck("12345Qw!");

      expect(pw).toBe(true);
    });

    it("should return false for less than 8 characters", async () => {
      const pw = await validPasswordCheck("123Qw!");

      expect(pw).toBe(false);
    });

    it("should return false if at least not one uppercase and one lowercase letter", async () => {
      const pw = await validPasswordCheck("1234567!");

      expect(pw).toBe(false);
    });

    it("should return false if not at least one special character", async () => {
      const pw = await validPasswordCheck("123456Qw");

      expect(pw).toBe(false);
    });
  });

  describe("passwordHash", () => {
    it("should return true if password and hash are the same", async () => {
      const pw = "12345Qw!";
      const hash = await bcrypt.hash(pw, 10);

      const compare = await bcrypt.compare(pw, hash);

      expect(compare).toBe(true);
    });
  });
});
