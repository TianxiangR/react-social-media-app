import { TOKEN_STORAGE_KEY } from '@/constants';
import { getFormDataFromObject, getQueryStringFromObject } from '@/lib/utils';
import { AugmentedPostPreview, IPost, IPostPreview, NewPost, NewUser, Notification, SearchLatestResult, SearchMediaResult, SearchPeopleResult, SearchTopResult, TokenResponse, User, UserProfile } from '@/types';


const baseUrl = import.meta.env.VITE_API_BASE_URL;

console.log('baseUrl', baseUrl);

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

export async function createPost(post: NewPost): Promise<AugmentedPostPreview> {
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

  const data = await response.json();
  return data;
}

export async function getPosts(): Promise<AugmentedPostPreview[]> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

  const response = await fetch(`${baseUrl}/api/posts/`, {
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

export async function replyPostById(postId: string, reply: NewPost): Promise<AugmentedPostPreview> {
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

  const data = await response.json();
  return data;
}

export async function repostPostById(postId: string, post: Partial<NewPost>): Promise<AugmentedPostPreview> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(post);
  const response = await fetch(`${baseUrl}/api/posts/${postId}/reposts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
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

export async function queryPostsByUsername(username: string): Promise<IPostPreview[]> {
  const response = await fetch(
    `${baseUrl}/api/users/${username}/posts/`,
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

export async function queryLikesByUsername(username: string): Promise<IPostPreview[]> {
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

export async function queryMediaByUsername(username: string): Promise<{images: string[]}> {
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

export async function updateProfile(username: string, user: Partial<UserProfile>): Promise<void> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const formData = getFormDataFromObject(user);
  const response = await fetch(`${baseUrl}/api/users/${username}/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
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

export async function searchTop(query: string): Promise<SearchTopResult> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/search/?q=${query}&type=top`, 
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

export async function searchLatest(query: string): Promise<SearchLatestResult> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/search/?q=${query}&type=latest`, 
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

export async function searchPeople(query: string): Promise<SearchPeopleResult> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/search/?q=${query}&type=people`, 
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

export async function searchMedia(query: string): Promise<SearchMediaResult> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const response = await fetch(`${baseUrl}/api/search/?q=${query}&type=media`, 
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


export async function getBookmarkedPosts(): Promise<AugmentedPostPreview[]> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

  const response = await fetch(`${baseUrl}/api/bookmarks/`, {
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