import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { initializeApp, getApps } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app (works on both server and client)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firebase Data Connect endpoint
// Uses FIREBASE_URL or NEXT_PUBLIC_FIREBASE_URL from .env
// Note: For client-side access, use NEXT_PUBLIC_FIREBASE_URL
const DATA_CONNECT_ENDPOINT = 
  process.env.NEXT_PUBLIC_FIREBASE_URL || 
  process.env.FIREBASE_URL || 
  process.env.NEXT_PUBLIC_DATA_CONNECT_ENDPOINT || 
  `https://data-connect-us-east4-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/graphql`;

// Log endpoint for debugging (only in development)
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('Data Connect Endpoint:', DATA_CONNECT_ENDPOINT);
  if (!process.env.NEXT_PUBLIC_FIREBASE_URL && !process.env.FIREBASE_URL && !process.env.NEXT_PUBLIC_DATA_CONNECT_ENDPOINT) {
    console.warn('⚠️  FIREBASE_URL or NEXT_PUBLIC_FIREBASE_URL not set in .env, using default');
    console.warn('   Add NEXT_PUBLIC_FIREBASE_URL=your_endpoint_url to .env (for client-side access)');
  }
}

// Create HTTP link
const httpLink = createHttpLink({
  uri: DATA_CONNECT_ENDPOINT,
});

// Create auth link to add Firebase Auth token
const authLink = setContext(async (_, { headers }) => {
  let token = '';
  
  // Only try to get auth token on client side
  if (typeof window !== 'undefined' && app) {
    try {
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (user) {
        token = await user.getIdToken();
      }
    } catch (error) {
      // Auth not required or not available - continue without token
      // This is OK if your Data Connect doesn't require authentication
    }
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'content-type': 'application/json',
    },
  };
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

