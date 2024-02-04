import { ID, Query } from 'appwrite';

import { INewPost, INewUser, IUpdatePost } from '@/types';

import { account, appwriteConfig, avatars, databases, storage } from './config';


export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(), 
      user.email, 
      user.password, 
      user.name
    );

    if (!newAccount) throw new Error('Error creating user account');

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl.toString(),
      username: user.username,
    });

    return newAccount;
  } catch (error) {
    console.error('Error creating user account: ', error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId, 
      ID.unique(),
      user
    );
  } catch (error) {
    console.error('Error saving user to database: ', error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.error('Error signing in user account: ', error);
    return error;
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error('Error getting current user account');

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error('Error getting current user: ', error);
    return;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    console.error('Error signing out user account: ', error);
  }
}

export async function uploadFile(file: File) {
  try {
    const newFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return newFile;
  } catch (error) {
    console.error('Error uploading file: ', error);
  }
}

export async function getFileURL(fileId: string) {
  try {
    const fileUrl = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
    );
    return fileUrl;
  } catch (error) {
    console.error('Error getting file preview: ', error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    const deletedFile = await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    );
    return deletedFile;
  } catch (error) {
    console.error('Error deleting file: ', error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw new Error('Error uploading file');

    // Get the file preview
    const fileUrl = await getFileURL(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Error getting file preview');
    }

    const tags = [...new Set((post.tags?.split(',') || [])
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0))];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error('Error creating post');
    }

    return newPost;
  } catch(error) {
    console.error('Error creating post: ', error);
  }
}

export async function getRecentPosts() {
  try {
    const recentPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)],
    );

    if (!recentPosts) throw new Error('Error getting recent posts');
    return recentPosts;
  } catch(error) {
    console.error('Error getting recent posts: ', error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw new Error('Error updating post');
    return updatedPost;
  } catch(error) {
    console.error('Error liking post: ', error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw new Error('Error updating post');
    return updatedPost;
  } catch(error) {
    console.error('Error saving post: ', error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw new Error('Error deleting post');
    return { status: 'ok'};
  } catch(error) {
    console.error('Error saving post: ', error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw new Error('Error getting post');
    return post;
  }
  catch(error) {
    console.error('Error getting post: ', error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpload = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpload) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw new Error('Error uploading file');

      // Get the file preview
      const fileUrl = await getFileURL(uploadedFile.$id);z;

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error('Error getting file preview');
      }

      image = {
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
      };
    }
  } catch(error) {
    console.error('Error updating post: ', error);
  }
}



