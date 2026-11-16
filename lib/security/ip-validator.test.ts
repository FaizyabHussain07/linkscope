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

  it("blocks IPv4-mapped private IPv6 addresses", () => {
    expect(isIpBlocked("::ffff:127.0.0.1")).toBe(true)
    expect(isIpBlocked("::ffff:192.168.1.10")).toBe(true)
    expect(isIpBlocked("::ffff:104.20.23.154")).toBe(false)
  })

  it("blocks non-public IPv4 ranges", () => {
    expect(isIpBlocked("100.64.0.1")).toBe(true)
    expect(isIpBlocked("198.19.0.1")).toBe(true)
    expect(isIpBlocked("240.0.0.1")).toBe(true)
  })
})
