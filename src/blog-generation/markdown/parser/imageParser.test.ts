import { describe, it } from "node:test";
import assert from "node:assert";
import { imageRegex, imageParse } from "./imageParser.ts"; // Update with your actual file path

describe("Image Parser Module", () => {
  describe("Isolated Function Arguments", () => {
    it("should successfully generate an img tag with valid arguments", () => {
      const result = imageParse(
        "/images/",
        "![Puppy](puppy.jpg)",
        "Puppy",
        "puppy.jpg",
      );
      assert.strictEqual(
        result,
        '<div class="post-image-frame"><img src="/images/puppy.jpg" alt="Puppy" class="post-image"></div>',
      );
    });

    it("should throw an error if altText is empty", () => {
      assert.throws(
        () => imageParse("/images/", "![](puppy.jpg)", "", "puppy.jpg"),
        {
          message:
            "Accessible image link missing either url (puppy.jpg), or altText (), or both",
        },
      );
    });

    it("should throw an error if altText contains only whitespace", () => {
      assert.throws(
        () => imageParse("/images/", "![   ](puppy.jpg)", "   ", "puppy.jpg"),
        {
          message:
            "Accessible image link missing either url (puppy.jpg), or altText (   ), or both",
        },
      );
    });

    it("should throw an error if url is empty", () => {
      assert.throws(() => imageParse("/images/", "![Puppy]()", "Puppy", ""), {
        message:
          "Accessible image link missing either url (), or altText (Puppy), or both",
      });
    });

    it("should throw an error if arguments are undefined", () => {
      assert.throws(
        () => imageParse("/images/", "![]()", undefined, undefined),
        {
          message:
            "Accessible image link missing either url (undefined), or altText (undefined), or both",
        },
      );
    });
  });

  describe("Integration with .replace()", () => {
    it("should parse a valid markdown image syntax into an HTML img tag", () => {
      const input = "Look at this: ![A beautiful sunset](sunset.jpg)";
      const output = input.replace(
        imageRegex,
        (_: string, altText?: string, url?: string) =>
          imageParse("/images/", _, altText, url),
      );
      assert.strictEqual(
        output,
        'Look at this: <div class="post-image-frame"><img src="/images/sunset.jpg" alt="A beautiful sunset" class="post-image"></div>',
      );
    });

    it("should throw an error during replacement if alt text is missing", () => {
      const input = "Inaccessible image: ![](sunset.jpg)";
      assert.throws(
        () =>
          input.replace(
            imageRegex,
            (_: string, altText?: string, url?: string) =>
              imageParse("/images/", _, altText, url),
          ),
        {
          message:
            "Accessible image link missing either url (sunset.jpg), or altText (), or both",
        },
      );
    });

    it("should throw an error during replacement if url is missing", () => {
      const input = "Broken image: ![Alt Text]()";
      assert.throws(
        () =>
          input.replace(
            imageRegex,
            (_: string, altText?: string, url?: string) =>
              imageParse("/images/", _, altText, url),
          ),
        {
          message:
            "Accessible image link missing either url (), or altText (Alt Text), or both",
        },
      );
    });

    it("should ignore standard text links and not run them through the parser", () => {
      const input =
        "This is a standard link: [Click Here](https://example.com)";
      const output = input.replace(
        imageRegex,
        (_: string, altText?: string, url?: string) =>
          imageParse("/images/", _, altText, url),
      );
      // String should remain untouched because it lacks the "!" prefix
      assert.strictEqual(
        output,
        "This is a standard link: [Click Here](https://example.com)",
      );
    });
  });
});
