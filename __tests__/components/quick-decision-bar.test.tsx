import { render, screen, fireEvent } from "@testing-library/react";
import QuickDecisionBar from "@/components/quick-decision-bar";

describe("QuickDecisionBar", () => {
  it("calls onAction when buttons are clicked", () => {
    const fn = jest.fn();
    render(<QuickDecisionBar onAction={fn} loading={false} />);

    const release = screen.getByRole("button", { name: /release/i });
    const reject = screen.getByRole("button", { name: /reject/i });

    fireEvent.click(release);
    fireEvent.click(reject);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith("approved");
    expect(fn).toHaveBeenCalledWith("rejected");
  });
});
