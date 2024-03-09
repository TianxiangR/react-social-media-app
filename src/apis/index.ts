import axios, { Axios, AxiosProgressEvent } from 'axios';

import { TOKEN_STORAGE_KEY } from '@/constants';
import { getFormDataFromObject, getQueryStringFromObject } from '@/lib/utils';
import { AugmentedPostPreview, NewPost, NewUser, Notification, Page, TokenResponse, User, UserProfile } from '@/types';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function isOkStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

export async function createUser(user: NewUser): Promise<TokenResponse> {

  const formData = getFormDataFromObject(user);
  const response = await fetch(`${baseUrl}/api/signup/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export async function signInUser(email: string, password: string): Promise<TokenResponse>{

  const response = await fetch(`${baseUrl}/api/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;

}

export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const response = await fetch(`${baseUrl}/api/get-current-user/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;

}

export async function publicQueryUser(query: Record<string, string | number | boolean | null>): Promise<{ found: boolean }> {
  const response = await fetch(`${baseUrl}/api/public-query-user/?${getQueryStringFromObject(query)}`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;

}

export async function createPost(post: NewPost, onUploadProgress?: (e: AxiosProgressEvent) => void): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(post);

  const response = await axios.post(`${baseUrl}/api/posts/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress,
  });

  if (!isOkStatus(response.status)) {
    throw new Error('Network response was not ok');
  }

  return response.data;
}

export async function getPosts(page: number, timestamp: number): Promise<Page<AugmentedPostPreview>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const urlSearchParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/posts/?${urlSearchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export async function likePost(postId: string): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/posts/${postId}/likes/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function unlikePost(postId: string): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/posts/${postId}/likes/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}


export async function getPostById(postId: string): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/posts/${postId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function getRepliesById(postId: string, page: number, timestamp: number): Promise<Page<AugmentedPostPreview>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const urlSearchParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });
  const response = await fetch(`${baseUrl}/api/posts/${postId}/replies/?${urlSearchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function deletePostById(postId: string): Promise<void> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/posts/${postId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
}

export async function replyPostById(postId: string, reply: NewPost, onUploadProgress?: (e: AxiosProgressEvent) => void): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(reply);
  const response = await axios.post(`${baseUrl}/api/posts/${postId}/replies/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress,
  });

  if (!isOkStatus(response.status)) {
    throw new Error('Network response was not ok');
  }

  return response.data;
}

export async function repostPostById(postId: string, post: NewPost, onUploadProgress?: (e: AxiosProgressEvent) => void): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(post);
  const response = await axios.post(`${baseUrl}/api/posts/${postId}/reposts/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress,
  });

  if (!isOkStatus(response.status)) {
    throw new Error('Network response was not ok');
  }

  return response.data;
}

export async function queryUserByUsername(username: string): Promise<User> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

  const response = await fetch(
    `${baseUrl}/api/users/${username}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function queryPostsByUsername(username: string, timestamp: number, page: number): Promise<Page<AugmentedPostPreview>> {
  const urlSearchParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(
    `${baseUrl}/api/users/${username}/posts/?${urlSearchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
      }
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function queryLikesByUsername(username: string, timestamp: number, page:number): Promise<Page<AugmentedPostPreview>> {
  const response = await fetch(
    `${baseUrl}/api/users/${username}/likes/`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
      }
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function queryMediaByUsername(username: string, timestamp: number, page: number): Promise<Page<string>> {
  const response = await fetch(
    `${baseUrl}/api/users/${username}/media/`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
      }
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function updateProfile(username: string, user: Partial<UserProfile>, onUploadProgress?: (e: AxiosProgressEvent) => void): Promise<User> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(user);
  const response = await axios.patch(`${baseUrl}/api/users/${username}/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress,
  });

  if (!isOkStatus(response.status)) {
    throw new Error('Network response was not ok');
  }

  return response.data;
}

export async function followUser(username: string): Promise<User> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/users/${username}/follow/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function unfollowUser(username: string): Promise<User> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/users/${username}/follow/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  return data;
}

export async function searchTop(query: string, timestamp: number, page: number): Promise<Page<AugmentedPostPreview>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    q: query,
    timestamp: timestamp.toString(),
    page: page.toString(),
    type: 'top',
  });
  const response = await fetch(`${baseUrl}/api/search/?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export async function searchLatest(query: string, timestamp: number, page: number): Promise<Page<AugmentedPostPreview>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    q: query,
    timestamp: timestamp.toString(),
    page: page.toString(),
    type: 'latest',
  });

  const response = await fetch(`${baseUrl}/api/search/?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export async function searchPeople(query: string, timestamp: number, page: number): Promise<Page<User>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    q: query,
    type: 'people',
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/search/?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export async function searchMedia(query: string, timestamp: number, page: number): Promise<Page<string>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    q: query,
    type: 'media',
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/search/?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export async function addBookmarkByPostId(postId: string): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/posts/${postId}/bookmarks/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function removeBookmarkByPostId(postId: string): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/posts/${postId}/bookmarks/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}


export async function getBookmarkedPosts(timestamp: number, page: number): Promise<Page<AugmentedPostPreview>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const seachParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/bookmarks/?${seachParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export async function getNotifications(): Promise<Notification[]> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/notifications/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export async function getTopRatedPosts(timestamp: number, page: number): Promise<Page<AugmentedPostPreview>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/top-rated/?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export async function getFollowingPosts(timestamp: number, page: number): Promise<Page<AugmentedPostPreview>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/following-posts/?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export async function getUserFollowers(username: string, timestamp: number, page: number): Promise<Page<User>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/users/${username}/followers/?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export async function getUserFollowing(username: string, timestamp: number, page: number): Promise<Page<User>> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const searchParams = new URLSearchParams({
    timestamp: timestamp.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${baseUrl}/api/users/${username}/following/?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/notifications/${notificationId}/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}