'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import type {Cooperative, CooperativeInput, Region, SiteSettings} from '@/lib/types';
import {normalizeSiteSettings} from '@/lib/site-settings';
import {fetchJson} from '@/lib/utils';
import {getUserKey, getVisitorKey} from '@/lib/client/identity';

export const queryKeys = {
  siteSettings: ['site-settings'] as const,
  regions: ['regions'] as const,
  cooperatives: (regionId?: string) => ['cooperatives', regionId || 'all'] as const,
  cooperative: (id: string) => ['cooperative', id] as const
};

export const adminJsonRequest = {
  'Content-Type': 'application/json'
};

const adminCredentials: Pick<RequestInit, 'credentials'> = {
  credentials: 'include'
};

export function useSiteSettings(initialData?: SiteSettings) {
  return useQuery({
    queryKey: queryKeys.siteSettings,
    queryFn: async () => normalizeSiteSettings((await fetchJson<{settings: SiteSettings}>('/api/site-settings')).settings),
    initialData: initialData ? normalizeSiteSettings(initialData) : undefined
  });
}

export function useRegions(initialData?: Region[]) {
  return useQuery({
    queryKey: queryKeys.regions,
    queryFn: async () => (await fetchJson<{regions: Region[]}>('/api/regions')).regions,
    initialData
  });
}

export function useCooperatives(regionId?: string, initialData?: Cooperative[]) {
  return useQuery({
    queryKey: queryKeys.cooperatives(regionId),
    queryFn: async () => {
      const userKey = getUserKey();
      const params = new URLSearchParams();
      if (regionId) params.set('regionId', regionId);
      params.set('userKey', userKey);
      return (await fetchJson<{cooperatives: Cooperative[]}>(`/api/cooperatives?${params}`)).cooperatives;
    },
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined
  });
}

export function useCooperative(id?: string, initialData?: Cooperative) {
  return useQuery({
    queryKey: queryKeys.cooperative(id || ''),
    queryFn: async () => {
      const userKey = getUserKey();
      return (await fetchJson<{cooperative: Cooperative}>(`/api/cooperatives/${id}?userKey=${userKey}`)).cooperative;
    },
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
    enabled: Boolean(id)
  });
}

export function useToggleLike(cooperativeId: string, regionId?: string) {
  const queryClient = useQueryClient();

  const applyLikeResult = (cooperative: Cooperative, result: {liked: boolean; likesCount: number}) => ({
    ...cooperative,
    liked: result.liked,
    likesCount: result.likesCount
  });

  const updateCooperativeCache = (result: {liked: boolean; likesCount: number}) => {
    queryClient.setQueryData<Cooperative | undefined>(queryKeys.cooperative(cooperativeId), (current) =>
      current ? applyLikeResult(current, result) : current
    );

    const updateList = (current: Cooperative[] | undefined) =>
      current?.map((item) => (item.id === cooperativeId ? applyLikeResult(item, result) : item));

    queryClient.setQueryData<Cooperative[] | undefined>(queryKeys.cooperatives(), updateList);
    if (regionId) {
      queryClient.setQueryData<Cooperative[] | undefined>(queryKeys.cooperatives(regionId), updateList);
    }
  };

  return useMutation({
    mutationFn: async () =>
      fetchJson<{liked: boolean; likesCount: number}>(`/api/cooperatives/${cooperativeId}/like`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userKey: getUserKey()})
      }),
    onSuccess: updateCooperativeCache,
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.cooperative(cooperativeId)});
      queryClient.invalidateQueries({queryKey: queryKeys.cooperatives()});
      if (regionId) queryClient.invalidateQueries({queryKey: queryKeys.cooperatives(regionId)});
    }
  });
}

export function useIncrementView(cooperativeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      fetchJson<{viewsCount: number}>(`/api/cooperatives/${cooperativeId}/view`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({visitorKey: getVisitorKey()})
      }),
    onSuccess: (result) => {
      queryClient.setQueryData<Cooperative | undefined>(queryKeys.cooperative(cooperativeId), (current) =>
        current ? {...current, viewsCount: result.viewsCount} : current
      );
    }
  });
}

export function useSaveSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SiteSettings) =>
      (await fetchJson<{settings: SiteSettings}>('/api/site-settings', {
        method: 'PUT',
        headers: adminJsonRequest,
        credentials: adminCredentials.credentials,
        body: JSON.stringify(settings)
      })).settings,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.siteSettings, settings);
      queryClient.invalidateQueries({queryKey: queryKeys.siteSettings});
    }
  });
}

export function useSaveRegion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (region: Region) =>
      (await fetchJson<{region: Region}>(`/api/regions/${region.id}`, {
        method: 'PUT',
        headers: adminJsonRequest,
        credentials: adminCredentials.credentials,
        body: JSON.stringify(region)
      })).region,
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.regions})
  });
}

export function useSaveCooperative(regionId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cooperative: CooperativeInput) =>
      (await fetchJson<{cooperative: Cooperative}>(`/api/cooperatives/${cooperative.id}`, {
        method: 'PUT',
        headers: adminJsonRequest,
        credentials: adminCredentials.credentials,
        body: JSON.stringify(cooperative)
      })).cooperative,
    onSuccess: (cooperative) => {
      queryClient.invalidateQueries({queryKey: queryKeys.cooperatives(regionId || cooperative.regionId)});
      queryClient.invalidateQueries({queryKey: queryKeys.cooperative(cooperative.id)});
    }
  });
}

export function useCreateCooperative(regionId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await fetchJson<{cooperative: Cooperative}>('/api/cooperatives', {
        method: 'POST',
        headers: adminJsonRequest,
        credentials: adminCredentials.credentials,
        body: JSON.stringify({regionId})
      })).cooperative,
    onSuccess: (cooperative) => {
      queryClient.invalidateQueries({queryKey: queryKeys.cooperatives(cooperative.regionId)});
    }
  });
}

export function useDeleteCooperative(regionId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      fetchJson<{ok: true}>(`/api/cooperatives/${id}`, {
        method: 'DELETE',
        credentials: adminCredentials.credentials
      }),
    onSuccess: () => {
      if (regionId) queryClient.invalidateQueries({queryKey: queryKeys.cooperatives(regionId)});
    }
  });
}
