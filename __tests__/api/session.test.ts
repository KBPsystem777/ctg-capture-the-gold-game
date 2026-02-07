import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/session/route";
import * as sessionLedger from "@/lib/session-ledger";

jest.mock("@/lib/session-ledger", () => ({
  createSessionWithAI: jest.fn(),
  createSession: jest.fn(),
}));

describe("/api/session", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a session and return success with hash", async () => {
    const mockSession = {
      id: "test-session-id",
      hash: "test-hash",
      transactions: [],
    };

    (sessionLedger.createSession as jest.Mock).mockReturnValue(mockSession);

    const { req } = createMocks({
      method: "POST",
    });

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.sessionId).toBe("test-session-id");
    expect(data.data.hash).toBe("test-hash");
  });

  it("should use OpenAI if key is present", async () => {
    const originalEnv = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "test-key";

    const mockSession = {
      id: "ai-session-id",
      hash: "ai-hash",
      transactions: [],
    };

    (sessionLedger.createSessionWithAI as jest.Mock).mockResolvedValue(
      mockSession,
    );

    const response = await POST();
    const data = await response.json();

    expect(sessionLedger.createSessionWithAI).toHaveBeenCalled();
    expect(data.data.sessionId).toBe("ai-session-id");

    process.env.OPENAI_API_KEY = originalEnv;
  });
});
