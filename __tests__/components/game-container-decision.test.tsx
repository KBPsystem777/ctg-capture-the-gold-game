import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GameContainer from "@/components/game-container";

// Mock global fetch behavior
const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test("single click via quick bar reveals evaluation and explanation", async () => {
  global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.includes("/api/session")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            success: true,
            data: { sessionId: "S1", hash: "HASH123" },
          }),
        ),
      );
    }

    if (url.includes("/api/decision")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            success: true,
            evaluation: {
              regulatorCorrect: true,
              message: "Good",
              explanation: "Ledger TXN-123 matches weight and date.",
              basis: { matchedFields: ["gold_weight_kg", "date"] },
            },
          }),
        ),
      );
    }

    return Promise.resolve(new Response(JSON.stringify({})));
  }) as any;

  render(<GameContainer claimId="CLAIM-001" onReset={() => {}} />);

  // Wait for quick bar release button to appear
  const release = await screen.findByRole("button", { name: /release/i });

  fireEvent.click(release);

  // Expect explanation to be displayed after API returns and modal to be opened
  await waitFor(() => {
    expect(
      screen.getByText(/Ledger TXN-123 matches weight and date/),
    ).toBeTruthy();
    expect(screen.getByText(/Decision explanation/)).toBeTruthy();
  });
});
