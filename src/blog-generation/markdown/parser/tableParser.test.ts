import { test } from "node:test";
import assert from "node:assert/strict";
import { tableRegex, tableParse } from "./tableParser.ts";

test("Table Parser Integration", async (t) => {
  await t.test("should convert a markdown table into semantic HTML", () => {
    const markdownInput = [
      "| Header 1 | Header 2 |",
      "| --- | --- |",
      "| Cell 1 | Cell 2 |",
      "| Cell 3 | Cell 4 |",
    ].join("\n");

    const expectedHtml = [
      '<div class="table-wrapper">',
      "<table>",
      "  <thead>",
      "    <tr>",
      "      <th>Header 1</th>",
      "      <th>Header 2</th>",
      "    </tr>",
      "  </thead>",
      "  <tbody>",
      "    <tr>",
      "      <td>Cell 1</td>",
      "      <td>Cell 2</td>",
      "    </tr>",
      "    <tr>",
      "      <td>Cell 3</td>",
      "      <td>Cell 4</td>",
      "    </tr>",
      "  </tbody>",
      "</table>",
      "</div>",
    ].join("\n");

    const result = markdownInput.replace(tableRegex, tableParse);

    assert.strictEqual(result.trim(), expectedHtml.trim());
  });
});
