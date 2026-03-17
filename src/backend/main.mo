import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type TransactionType = {
    #send;
    #topup;
  };

  type TransactionStatus = {
    #completed;
    #failed;
  };

  type Transaction = {
    id : Text;
    from : Principal;
    to : Principal;
    amount : Int;
    timestamp : Time.Time;
    transactionType : TransactionType;
    status : TransactionStatus;
  };

  type UserProfile = {
    username : Text;
    balance : Int;
  };

  module Transaction {
    public func compareByTimestamp(a : Transaction, b : Transaction) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  // Prefab authorization system with shared state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let transactions = Map.empty<Principal, List.List<Transaction>>();

  // Constants
  let INITIAL_BALANCE : Int = 1000;

  // Helper functions
  func getOrCreateProfile(user : Principal) : UserProfile {
    switch (userProfiles.get(user)) {
      case (null) {
        let profile : UserProfile = {
          username = "";
          balance = INITIAL_BALANCE;
        };
        userProfiles.add(user, profile);
        profile;
      };
      case (?profile) { profile };
    };
  };

  // Public functions
  public query ({ caller }) func getBalance() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get balance");
    };
    getOrCreateProfile(caller).balance;
  };

  public shared ({ caller }) func sendMoney(to : Principal, amount : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send money");
    };
    if (amount <= 0) { Runtime.trap("Invalid amount") };
    let senderProfile = getOrCreateProfile(caller);
    if (senderProfile.balance < amount) {
      Runtime.trap("Insufficient balance");
    };

    let receiverProfile = getOrCreateProfile(to);

    let transaction : Transaction = {
      id = caller.toText() # to.toText() # amount.toText();
      from = caller;
      to;
      amount;
      timestamp = Time.now();
      transactionType = #send;
      status = #completed;
    };

    let updatedSender : UserProfile = {
      username = senderProfile.username;
      balance = senderProfile.balance - amount;
    };
    userProfiles.add(caller, updatedSender);

    let updatedReceiver : UserProfile = {
      username = receiverProfile.username;
      balance = receiverProfile.balance + amount;
    };
    userProfiles.add(to, updatedReceiver);

    if (transactions.containsKey(caller)) {
      switch (transactions.get(caller)) {
        case (?list) {
          list.add(transaction);
        };
        case (null) {};
      };
    } else {
      transactions.add(caller, List.empty<Transaction>());
    };
  };

  public shared ({ caller }) func topUp(amount : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can top up");
    };
    if (amount <= 0) { Runtime.trap("Invalid amount") };

    let profile = getOrCreateProfile(caller);
    let updatedProfile : UserProfile = {
      username = profile.username;
      balance = profile.balance + amount;
    };
    userProfiles.add(caller, updatedProfile);

    let transaction : Transaction = {
      id = updatedProfile.username # "?topup#" # amount.toText();
      from = caller;
      to = caller;
      amount;
      timestamp = Time.now();
      transactionType = #topup;
      status = #completed;
    };

    if (transactions.containsKey(caller)) {
      switch (transactions.get(caller)) {
        case (?list) {
          list.add(transaction);
        };
        case (null) {};
      };
    } else {
      transactions.add(caller, List.empty<Transaction>());
    };
  };

  public shared ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray().sort(Transaction.compareByTimestamp) };
    };
  };

  public shared ({ caller }) func setUsername(username : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set username");
    };
    let profile = getOrCreateProfile(caller);
    let updatedProfile : UserProfile = {
      username;
      balance = profile.balance;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func userExists(user : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check user existence");
    };
    userProfiles.containsKey(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
