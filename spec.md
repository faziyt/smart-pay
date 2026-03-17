# Smart Pay

## Current State
New project. Empty workspace with no existing application files.

## Requested Changes (Diff)

### Add
- Full authentication system: sign up, login, mock OTP verification
- Dashboard with wallet balance and recent transactions
- Send money feature (by email/username, with confirmation flow)
- Receive money screen with unique user ID
- Transaction history with date, amount, status
- Wallet system: add balance (mock), deduct on transfer, real-time balance update
- Mobile-responsive fintech UI with blue/white theme

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - Authorization component for user accounts
   - User profile with balance field
   - Transaction record type (sender, receiver, amount, timestamp, status)
   - Endpoints: getBalance, sendMoney, addBalance, getTransactions, getUserByEmail

2. Frontend (React + TypeScript):
   - Auth screens: Login, Sign Up, OTP verification (mock)
   - Dashboard: balance card, quick actions, recent transactions
   - Send Money screen: recipient input, amount, confirmation modal
   - Receive Money screen: display user ID
   - Transaction History screen: full list with filters
   - Mobile-responsive layout with bottom navigation
   - Blue/white fintech theme
