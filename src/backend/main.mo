import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat8 "mo:core/Nat8";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type Mode = {
    #car;
    #bus;
    #train;
    #flight;
    #bike;
  };

  public type Conditional = {
    #onCar : CarDetails;
    #onBus : BusDetails;
    #onTrain : TrainDetails;
    #onFlight : FlightDetails;
  };

  public type CarDetails = {
    registration : Text;
    verified : Bool;
  };

  public type BusDetails = {
    operator : Text;
    seatNumber : Nat;
    ticketReference : ?Text;
    verified : Bool;
  };

  public type TrainDetails = {
    trainNumber : Text;
    trainName : Text;
    pnr : Text;
    seatBerth : Text;
    verified : Bool;
  };

  public type FlightDetails = {
    flightNumber : Text;
    airline : Text;
    bookingPNR : Text;
    confirmed : Bool;
  };

  public type Parcel = {
    id : Nat;
    sender : Principal;
    description : Text;
    travelMode : Mode;
  };

  public type Trip = {
    id : Nat;
    carrier : Principal;
    details : Conditional;
    travelMode : Mode;
    verified : Bool;
  };

  public type Rating = {
    user : Principal;
    score : Nat8;
  };

  public type UserProfile = {
    name : Text;
    identityVerified : Bool;
    phoneVerified : Bool;
    emailVerified : Bool;
    governmentIdUploaded : Bool;
    phoneNumber : ?Text;
    governmentIdAddress : ?Text;
  };

  module Rating {
    public func compare(rating1 : Rating, rating2 : Rating) : Order.Order {
      Nat8.compare(rating1.score, rating2.score);
    };
  };

  // Persistent data stores
  let parcels = Map.empty<Nat, Parcel>();
  let trips = Map.empty<Nat, Trip>();
  var nextParcelId = 0;
  var nextTripId = 0;
  let ratings = Map.empty<Principal, List.List<Rating>>();
  let notifs = Map.empty<Principal, List.List<Text>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();

  // core auth and storage mixins
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Sign up function - now includes additional fields for phone number and government ID address
  public shared ({ caller }) func signUp(name : Text, phoneNumber : Text, governmentIdAddress : Text) : async () {
    // Check if user already exists
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already exists");
    };

    let newUserProfile : UserProfile = {
      name;
      identityVerified = false;
      phoneVerified = false;
      emailVerified = false;
      governmentIdUploaded = false;
      phoneNumber = ?phoneNumber;
      governmentIdAddress = ?governmentIdAddress;
    };

    userProfiles.add(caller, newUserProfile);
  };

  // User Profile management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Verification flows
  public shared ({ caller }) func verifyMobileNumber(otp : Text) : async Bool {
    // No role check - any authenticated principal can verify their mobile
    if (otp != "123456") {
      Runtime.trap("Invalid OTP");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        userProfiles.add(caller, { profile with phoneVerified = true });
        true;
      };
    };
  };

  public shared ({ caller }) func verifyEmail(otp : Text) : async Bool {
    // No role check - any authenticated principal can verify their email
    if (otp != "123456") {
      Runtime.trap("Invalid OTP");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        userProfiles.add(caller, { profile with emailVerified = true });
        true;
      };
    };
  };

  public shared ({ caller }) func uploadFrontIdScan(blob : Storage.ExternalBlob) : async {
    #external : Storage.ExternalBlob;
  } {
    // No role check - any authenticated principal can upload their ID to become verified
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        userProfiles.add(caller, { profile with governmentIdUploaded = true });
      };
    };
    #external(blob);
  };

  public shared ({ caller }) func adminVerifyUserId(user : Principal) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        userProfiles.add(user, { profile with identityVerified = true });
        true;
      };
    };
  };

  // Parcel management logic
  public shared ({ caller }) func createParcel(desc : Text, mode : Mode) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create parcels");
    };
    let id = nextParcelId;
    parcels.add(
      id,
      {
        id;
        sender = caller;
        description = desc;
        travelMode = mode;
      },
    );
    nextParcelId += 1;
    id;
  };

  public query func getParcel(id : Nat) : async ?Parcel {
    // No auth check - public read access
    parcels.get(id);
  };

  public query func listParcels() : async [Parcel] {
    parcels.values().toArray();
  };

  public shared ({ caller }) func updateParcel(id : Nat, desc : Text, mode : Mode) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update parcels");
    };
    switch (parcels.get(id)) {
      case (null) { Runtime.trap("Parcel not found") };
      case (?parcel) {
        if (parcel.sender != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own parcels");
        };
        parcels.add(
          id,
          {
            id;
            sender = parcel.sender;
            description = desc;
            travelMode = mode;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteParcel(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete parcels");
    };
    switch (parcels.get(id)) {
      case (null) { Runtime.trap("Parcel not found") };
      case (?parcel) {
        if (parcel.sender != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own parcels");
        };
        parcels.remove(id);
      };
    };
  };

  // Trip management logic
  public shared ({ caller }) func createTrip(details : Conditional, mode : Mode) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create trips");
    };
    let id = nextTripId;
    trips.add(
      id,
      {
        id;
        carrier = caller;
        details;
        travelMode = mode;
        verified = false;
      },
    );
    nextTripId += 1;
    id;
  };

  public query func getTrip(id : Nat) : async ?Trip {
    trips.get(id);
  };

  public query func listTrips() : async [Trip] {
    trips.values().toArray();
  };

  public shared ({ caller }) func updateTrip(id : Nat, details : Conditional, mode : Mode) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update trips");
    };
    switch (trips.get(id)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        if (trip.carrier != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own trips");
        };
        trips.add(
          id,
          {
            id;
            carrier = trip.carrier;
            details;
            travelMode = mode;
            verified = trip.verified;
          },
        );
      };
    };
  };

  public shared ({ caller }) func markTripVerified(id : Nat, verified : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify trips");
    };
    switch (trips.get(id)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        if (trip.carrier != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only verify your own trips");
        };
        trips.add(
          id,
          {
            id = trip.id;
            carrier = trip.carrier;
            details = trip.details;
            travelMode = trip.travelMode;
            verified;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteTrip(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete trips");
    };
    switch (trips.get(id)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        if (trip.carrier != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own trips");
        };
        trips.remove(id);
      };
    };
  };

  // Rating management
  public shared ({ caller }) func submitRating(user : Principal, score : Nat8) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit ratings");
    };
    if (score > 5) {
      Runtime.trap("Invalid rating: score must be between 0 and 5");
    };
    let newRating : Rating = {
      user = caller;
      score;
    };
    let existing = switch (ratings.get(user)) {
      case (null) { List.empty<Rating>() };
      case (?list) { list };
    };
    existing.add(newRating);
    let sorted = existing.toArray().sort();
    ratings.add(user, List.fromArray<Rating>(sorted));
  };

  public query func getRatings(user : Principal) : async [Rating] {
    switch (ratings.get(user)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  // Notification management
  public shared ({ caller }) func addNotif(message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add notifications");
    };
    let existing = switch (notifs.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?list) { list };
    };
    existing.add(message);
    notifs.add(caller, existing);
  };

  public query ({ caller }) func getNotifications() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };
    switch (notifs.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  // Test functions
  public query ({ caller }) func mustBeUser() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this function");
    };
  };

  public query ({ caller }) func mustBeAdmin() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
  };
};
