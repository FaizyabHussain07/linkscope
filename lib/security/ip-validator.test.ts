import { describe, expect, it } from "vitest"
import { isIpBlocked } from "./ip-validator"

describe("IP blocking", () => {
  it("allows public IPv4 addresses", () => {
    expect(isIpBlocked("104.20.23.154")).toBe(false)
  })

  it("blocks private and metadata IPv4 addresses", () => {
    expect(isIpBlocked("192.168.1.1")).toBe(true)
    expect(isIpBlocked("169.254.169.254")).toBe(true)
  })

  it("blocks local IPv6 addresses", () => {
    expect(isIpBlocked("::1")).toBe(true)
    expect(isIpBlocked("fd00::1")).toBe(true)
  })
})
