import { clearToken, getToken, httpPublic, setToken } from "./http";

describe("http", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("可以儲存及取得 token", () => {
    setToken("test-token");

    expect(getToken()).toBe("test-token");
  });

  it("可以清除 token", () => {
    setToken("test-token");
    clearToken();

    expect(getToken()).toBeNull();
  });

  it("public API 不帶 Authorization header", async () => {
    setToken("abc123");

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ token: "new-token" }), {
        status: 200,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await httpPublic("accounts/login");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/accounts/login",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  });
});
