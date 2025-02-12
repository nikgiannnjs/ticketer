import { describe, it, expect } from "vitest";
import { checkRequiredFields } from "@/utils/checkRequiredFields";

describe("checkRequiredFields", async () => {
  it("should return an empty array if fields are the same", async () => {
    const body = { field1: "value1", field2: "value2", field3: "value3" };
    const requiredFields = ["field1", "field2", "field3"];

    const compare = await checkRequiredFields(body, requiredFields);

    expect(compare.length).toBe(0);
  });

  it("should return an array with the missing fields", async () => {
    const body = { field1: "value1", field2: "value2" };
    const requiredFields = ["field1", "field2", "field3"];

    const compare = await checkRequiredFields(body, requiredFields);

    expect(compare).toEqual(["field3"]);
  });
});
