# Tasks: Optimize Chat and UI for Mobile

- [ ] Update `app/api/chat/route.ts` with the new system prompt 🔐
    - Replace `defaultPrompt` with the provided "AI Claimant — System Context"
    - Ensure messages mapping handles "claimant" and "regulator" roles correctly
- [ ] Refactor `GameContainer.tsx` for mobile tabs
    - Install/Import `Tabs` from `@/components/ui/tabs`
    - Implement conditional layout: 3-column grid for `md+`, Tabs for `<md`
- [ ] Optimize `ChatPanel.tsx`
    - Remove fixed `min-h-96`
    - Ensure chat input is sticky or well-positioned on mobile
    - Verify message bubble contrast on light background
- [ ] Optimize `DecisionPanel.tsx`
    - Make the "Trust Hierarchy" table responsive (use horizontal scroll or stack)
    - Enhance button tap targets (44px+)
- [ ] Validate Chat API with the provided `curl` command
    - Fix any mapping issues between "claimant" role and "assistant" roles
- [ ] Final UI review on mobile viewport
