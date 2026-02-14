import Map "mo:core/Map";
import List "mo:core/List";
import Nat8 "mo:core/Nat8";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    identityVerified : Bool;
    phoneVerified : Bool;
    emailVerified : Bool;
    governmentIdUploaded : Bool;
  };

  type OldActor = {
    parcels : Map.Map<Nat, { id : Nat; sender : Principal; description : Text; travelMode : { #car; #bus; #train; #flight; #bike } }>;
    trips : Map.Map<Nat, { id : Nat; carrier : Principal; details : { #onCar : { registration : Text; verified : Bool }; #onBus : { operator : Text; seatNumber : Nat; ticketReference : ?Text; verified : Bool }; #onTrain : { trainNumber : Text; trainName : Text; pnr : Text; seatBerth : Text; verified : Bool }; #onFlight : { flightNumber : Text; airline : Text; bookingPNR : Text; confirmed : Bool } }; travelMode : { #car; #bus; #train; #flight; #bike }; verified : Bool }>;
    nextParcelId : Nat;
    nextTripId : Nat;
    ratings : Map.Map<Principal, List.List<{ user : Principal; score : Nat8 }>>;
    notifs : Map.Map<Principal, List.List<Text>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewUserProfile = {
    name : Text;
    identityVerified : Bool;
    phoneVerified : Bool;
    emailVerified : Bool;
    governmentIdUploaded : Bool;
    phoneNumber : ?Text;
    governmentIdAddress : ?Text;
  };

  type NewActor = {
    parcels : Map.Map<Nat, { id : Nat; sender : Principal; description : Text; travelMode : { #car; #bus; #train; #flight; #bike } }>;
    trips : Map.Map<Nat, { id : Nat; carrier : Principal; details : { #onCar : { registration : Text; verified : Bool }; #onBus : { operator : Text; seatNumber : Nat; ticketReference : ?Text; verified : Bool }; #onTrain : { trainNumber : Text; trainName : Text; pnr : Text; seatBerth : Text; verified : Bool }; #onFlight : { flightNumber : Text; airline : Text; bookingPNR : Text; confirmed : Bool } }; travelMode : { #car; #bus; #train; #flight; #bike }; verified : Bool }>;
    nextParcelId : Nat;
    nextTripId : Nat;
    ratings : Map.Map<Principal, List.List<{ user : Principal; score : Nat8 }>>;
    notifs : Map.Map<Principal, List.List<Text>>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, old) {
        { old with phoneNumber = null; governmentIdAddress = null };
      }
    );
    { old with userProfiles = newUserProfiles };
  };
};
