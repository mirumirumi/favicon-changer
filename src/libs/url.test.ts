import { matchUrlPattern } from "./url"

describe("matchUrlPattern", () => {
  describe("exactly matches", () => {
    describe("domain", () => {
      test("no trailing slash", () => {
        const url = "https://google.com"
        expect(matchUrlPattern(url, "https://google.com")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/")).toEqual(true)
        expect(matchUrlPattern(url, "http://google.com")).toEqual(false)
        expect(matchUrlPattern(url, "https://www.google.com")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com")).toEqual(false)
      })

      test("trailing slash", () => {
        const url = "https://google.com/"
        expect(matchUrlPattern(url, "https://google.com")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/")).toEqual(true)
        expect(matchUrlPattern(url, "http://google.com")).toEqual(false)
        expect(matchUrlPattern(url, "https://www.google.com")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com")).toEqual(false)
      })
    })

    describe("path", () => {
      test("no extension", () => {
        const url = "https://google.com/abc/def"
        expect(matchUrlPattern(url, "https://google.com/abc/def")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/abc/def/")).toEqual(true)
        expect(matchUrlPattern(url, "http://google.com/abz/def")).toEqual(false)
        expect(matchUrlPattern(url, "https://www.google.com/abc/def")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com/abc/def")).toEqual(false)
      })

      test("extension", () => {
        const url = "https://google.com/abc/def.php"
        expect(matchUrlPattern(url, "https://google.com/abc/def.php")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/abc/def.php/")).toEqual(true)
        expect(matchUrlPattern(url, "http://google.com/abc/def.ppp")).toEqual(false)
        expect(matchUrlPattern(url, "https://www.google.com/abc/def.php")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com/abc/def.php")).toEqual(false)
      })
    })
  })

  describe("glob pattern", () => {
    describe("domain", () => {
      test("no trailing slash", () => {
        const url = "https://google.com/*"
        expect(matchUrlPattern(url, "https://google.com")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/bbb/ccc.txt")).toEqual(true)
        expect(matchUrlPattern(url, "https://www.google.com")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com")).toEqual(false)
      })

      test("trailing slash", () => {
        const url = "https://google.com/*/"
        expect(matchUrlPattern(url, "https://google.com")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/bbb/ccc.txt")).toEqual(true)
        expect(matchUrlPattern(url, "https://www.google.com")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com")).toEqual(false)
      })
    })

    describe("trailing path", () => {
      test("no trailing slash", () => {
        const url = "https://google.com/aaa/*"
        expect(matchUrlPattern(url, "https://google.com/aaa")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/aaa")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/aaa/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/aaa/bbb/ccc.txt")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/bbb/aaa")).toEqual(false)
        expect(matchUrlPattern(url, "https://www.google.com/aaa/aaa")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com/aaa/aaa")).toEqual(false)
      })

      test("trailing slash", () => {
        const url = "https://google.com/aaa/*/"
        expect(matchUrlPattern(url, "https://google.com/aaa")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/aaa")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/aaa/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/aaa/bbb/ccc.txt")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/bbb/aaa")).toEqual(false)
        expect(matchUrlPattern(url, "https://www.google.com/aaa/aaa")).toEqual(false)
        expect(matchUrlPattern(url, "https://g00gle.com/aaa/aaa")).toEqual(false)
      })
    })

    describe("middle path", () => {
      test("no trailing slash", () => {
        const url = "https://google.com/aaa/*/bbb"
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb/ccc")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb/ccc")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/")).toEqual(false)
      })

      test("trailing slash", () => {
        const url = "https://google.com/aaa/*/bbb/"
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb/ccc")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb/ccc")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/")).toEqual(false)
      })
    })

    describe("middle path and trailing path", () => {
      test("no trailing slash", () => {
        const url = "https://google.com/aaa/*/bbb/*"
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb/ccc")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb/ccc")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/ccc/ccc")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/")).toEqual(false)
      })

      test("trailing slash", () => {
        const url = "https://google.com/aaa/*/bbb/*/"
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/bbb/ccc")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/yyy/bbb/ccc")).toEqual(true)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/ccc/ccc")).toEqual(false)
        expect(matchUrlPattern(url, "https://google.com/aaa/xxx/")).toEqual(false)
      })
    })
  })
})
