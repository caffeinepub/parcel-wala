import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Parcel, Trip, UserProfile, Mode, Conditional, Rating } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSignUp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, phoneNumber, governmentIdAddress }: { name: string; phoneNumber: string; governmentIdAddress: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.signUp(name, phoneNumber, governmentIdAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile(principal: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUserProfiles() {
  const { actor, isFetching } = useActor();
  const { data: parcels = [] } = useListParcels();
  const { data: trips = [] } = useListTrips();

  const allPrincipals = [
    ...parcels.map(p => p.sender.toString()),
    ...trips.map(t => t.carrier.toString()),
  ];
  const uniquePrincipals = [...new Set(allPrincipals)];

  return useQuery<Record<string, UserProfile | null>>({
    queryKey: ['allUserProfiles', uniquePrincipals],
    queryFn: async () => {
      if (!actor) return {};
      const profiles: Record<string, UserProfile | null> = {};
      await Promise.all(
        uniquePrincipals.map(async (principalStr) => {
          try {
            const principal = Principal.fromText(principalStr);
            const profile = await actor.getUserProfile(principal);
            profiles[principalStr] = profile;
          } catch (error) {
            profiles[principalStr] = null;
          }
        })
      );
      return profiles;
    },
    enabled: !!actor && !isFetching && uniquePrincipals.length > 0,
  });
}

// Parcel Queries
export function useListParcels() {
  const { actor, isFetching } = useActor();

  return useQuery<Parcel[]>({
    queryKey: ['parcels'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listParcels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateParcel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ desc, mode }: { desc: string; mode: Mode }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createParcel(desc, mode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}

export function useDeleteParcel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteParcel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] });
    },
  });
}

// Trip Queries
export function useListTrips() {
  const { actor, isFetching } = useActor();

  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTrips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ details, mode }: { details: Conditional; mode: Mode }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTrip(details, mode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useDeleteTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTrip(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

// Ratings
export function useGetRatings(principal: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Rating[]>({
    queryKey: ['ratings', principal.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRatings(principal);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, score }: { user: Principal; score: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRating(user, score);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', variables.user.toString()] });
    },
  });
}

// Notifications
export function useGetNotifications() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

// Unread counts (simulated)
export function useUnreadCounts() {
  return {
    chatUnread: 0,
    notificationsUnread: 0,
  };
}
