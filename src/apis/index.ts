import { TOKEN_STORAGE_KEY } from '@/constants';
import { getFormDataFromObject, getQueryStringFromObject } from '@/lib/utils';
import { IPost, IPostPreview, NewPost, NewUser, TokenResponse, User } from '@/types';


const baseUrl = import.meta.env.VITE_API_BASE_URL;

console.log('baseUrl', baseUrl);

export async function createUser(user: NewUser): Promise<TokenResponse | undefined> {

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

export async function signInUser(email: string, password: string): Promise<TokenResponse | undefined>{

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

export async function getCurrentUser(): Promise<User | undefined> {
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

export async function publicQueryUser(query: Record<string, string | number | boolean | null>): Promise<{ found: boolean } | undefined> {
  const response = await fetch(`${baseUrl}/api/public-query-user/?${getQueryStringFromObject(query)}`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;

}

export async function createPost(post: NewPost): Promise<void> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(post);
  console.log(formData.get('content'));
  

  const response = await fetch(`${baseUrl}/api/posts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

}

export async function getPosts(): Promise<IPostPreview[] | undefined> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

  const response = await fetch(`${baseUrl}/api/posts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: IPostPreview[] = await response.json();

  console.log(data);

  return data;

}

export async function likePost(postId: string): Promise<void> {
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
}

export async function unlikePost(postId: string): Promise<void> {
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
}


export async function getPostById(postId: string): Promise<IPost> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/posts/${postId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: IPost = await response.json();
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

export async function replyPostById(postId: string, reply: NewPost): Promise<void> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(reply);
  const response = await fetch(`${baseUrl}/api/posts/${postId}/replies/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
}