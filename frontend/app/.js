// ============================================
// File: frontend/lib/api.ts
// ============================================
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const API: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// Authentication API
// ============================================
export const auth = {
  login: (email: string, password: string) => 
    API.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string;
    password: string;
    phone?: string;
    fullName?: string;
  }) => API.post('/auth/register', data),
  
  refresh: (refreshToken: string) => 
    API.post('/auth/refresh', { refresh_token: refreshToken }),
  
  logout: () => API.post('/auth/logout')
};

// ============================================
// User API
// ============================================
export const users = {
  getProfile: () => API.get('/users/me'),
  updateProfile: (data: any) => API.put('/users/me', data),
  updatePreferences: (preferences: any) => 
    API.put('/users/me/preferences', preferences)
};

// ============================================
// Provinces API
// ============================================
export const provinces = {
  getAll: () => API.get('/provinces'),
  getOne: (id: number) => API.get(`/provinces/${id}`),
  getAttractions: (id: number) => API.get(`/provinces/${id}/attractions`)
};

// ============================================
// News API
// ============================================
export const news = {
  getAll: (page = 1, category?: string) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (category) params.append('category', category);
    return API.get(`/news?${params.toString()}`);
  },
  
  getOne: (id: string) => API.get(`/news/${id}`),
  
  getTrending: () => API.get('/news/trending'),
  
  search: (query: string) => API.get(`/news/search?q=${query}`)
};

// ============================================
// Events API
// ============================================
export const events = {
  getUpcoming: (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return API.get(`/events${params}`);
  },
  
  getOne: (id: string) => API.get(`/events/${id}`),
  
  book: (id: string, quantity: number, holder: {
    name: string;
    email: string;
  }) => API.post(`/events/${id}/book`, { quantity, holder }),
  
  getMyTickets: () => API.get('/events/my-tickets'),
  
  cancelTicket: (ticketId: string) => API.post(`/events/tickets/${ticketId}/cancel`)
};

// ============================================
// Shopping API
// ============================================
export const shopping = {
  getProducts: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return API.get(`/shopping/products?${params.toString()}`);
  },
  
  getProduct: (id: string) => API.get(`/shopping/products/${id}`),
  
  createOrder: (items: any[], deliveryAddress: any) => 
    API.post('/shopping/orders', { items, deliveryAddress }),
  
  getOrders: () => API.get('/shopping/orders'),
  
  getOrder: (id: string) => API.get(`/shopping/orders/${id}`),
  
  cancelOrder: (id: string) => API.post(`/shopping/orders/${id}/cancel`)
};

// ============================================
// Traffic API
// ============================================
export const traffic = {
  getLive: (provinceId?: number) => {
    const params = provinceId ? `?provinceId=${provinceId}` : '';
    return API.get(`/traffic/live${params}`);
  },
  
  getIncidents: () => API.get('/traffic/incidents'),
  
  reportIncident: (data: {
    type: string;
    location: string;
    description: string;
  }) => API.post('/traffic/incidents', data)
};

// ============================================
// Payments API
// ============================================
export const payments = {
  purchaseElectricity: (
    meterNumber: string,
    amount: number,
    paymentMethod: string
  ) => API.post('/payments/electricity/purchase', {
    meterNumber,
    amount,
    paymentMethod
  }),
  
  getMeterInfo: (meterNumber: string) => 
    API.get(`/payments/electricity/meter/${meterNumber}`),
  
  getHistory: () => API.get('/payments/history')
};

// ============================================
// AI Chatbot API
// ============================================
export const ai = {
  chat: (message: string, language: string, history: any[]) =>
    API.post('/ai/chat', { message, language, history })
};

export default API;

// ============================================
// File: frontend/lib/i18n.ts
// ============================================
export const translations = {
  fr: {
    nav: {
      home: 'Accueil',
      provinces: 'Provinces',
      news: 'Actualités',
      events: 'Événements',
      shopping: 'Shopping',
      traffic: 'Trafic',
      utilities: 'Services',
      dashboard: 'Tableau de bord'
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      login: 'Connexion',
      logout: 'Déconnexion',
      register: "S'inscrire",
      search: 'Rechercher',
      viewAll: 'Voir tout',
      bookNow: 'Réserver',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer'
    },
    home: {
      hero: 'Bienvenue sur Burundi Hub 🇧🇮',
      subtitle: 'Votre portail numérique',
      services: 'Services disponibles',
      install: "Installer l'application"
    },
    news: {
      latest: 'Dernières actualités',
      trending: 'Tendances',
      readMore: 'Lire plus'
    },
    auth: {
      emailPlaceholder: 'votre@email.com',
      passwordPlaceholder: '••••••••',
      noAccount: 'Pas de compte?',
      haveAccount: 'Déjà un compte?',
      signUpHere: 'S\'inscrire ici',
      signInHere: 'Se connecter'
    }
  },
  en: {
    nav: {
      home: 'Home',
      provinces: 'Provinces',
      news: 'News',
      events: 'Events',
      shopping: 'Shopping',
      traffic: 'Traffic',
      utilities: 'Utilities',
      dashboard: 'Dashboard'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      search: 'Search',
      viewAll: 'View All',
      bookNow: 'Book Now',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save'
    },
    home: {
      hero: 'Welcome to Burundi Hub 🇧🇮',
      subtitle: 'Your digital gateway',
      services: 'Available Services',
      install: 'Install App'
    },
    news: {
      latest: 'Latest News',
      trending: 'Trending',
      readMore: 'Read More'
    },
    auth: {
      emailPlaceholder: 'your@email.com',
      passwordPlaceholder: '••••••••',
      noAccount: 'No account?',
      haveAccount: 'Have an account?',
      signUpHere: 'Sign up here',
      signInHere: 'Sign in'
    }
  },
  rn: {
    nav: {
      home: 'Itangiriro',
      provinces: 'Intara',
      news: 'Amakuru',
      events: 'Ibirori',
      shopping: 'Kugura',
      traffic: 'Imihora',
      utilities: 'Serivisi',
      dashboard: 'Ikibaho'
    },
    common: {
      loading: 'Gushaka...',
      error: 'Ikosa',
      login: 'Injira',
      logout: 'Sohoka',
      register: 'Iyandikishe',
      search: 'Shakisha',
      viewAll: 'Reba vyose',
      bookNow: 'Gutumiza',
      cancel: 'Hagarika',
      confirm: 'Emeza',
      save: 'Bika'
    },
    home: {
      hero: 'Murakaza neza kuri Burundi Hub 🇧🇮',
      subtitle: 'Urubuga rwawe',
      services: 'Serivisi',
      install: 'Shyiramo app'
    },
    news: {
      latest: 'Amakuru mashya',
      trending: 'Vy\'ingenzi',
      readMore: 'Soma byinshi'
    },
    auth: {
      emailPlaceholder: 'email@yawe.com',
      passwordPlaceholder: '••••••••',
      noAccount: 'Ntago ufise konti?',
      haveAccount: 'Ufise konti?',
      signUpHere: 'Iyandikishe hano',
      signInHere: 'Injira'
    }
  }
};

export type Locale = 'fr' | 'en' | 'rn';

export const useT = (locale: string = 'fr') => {
  const currentLocale = (locale || 'fr') as Locale;
  
  return (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[currentLocale];
    
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return path; // Return path if translation not found
      }
    }
    
    return typeof value === 'string' ? value : path;
  };
};

// ============================================
// File: frontend/lib/websocket.ts
// ============================================
import { io, Socket } from 'socket.io-client';

export class TrafficWebSocket {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    
    this.socket = io(WS_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.socket?.close();
      }
    });

    return this.socket;
  }

  subscribeProvince(provinceId: number, callback: (data: any) => void): void {
    if (!this.socket) this.connect();
    
    this.socket?.emit('subscribe-province', provinceId);
    this.socket?.on('traffic-update', callback);
  }

  unsubscribeProvince(provinceId: number): void {
    if (!this.socket) return;
    this.socket.emit('unsubscribe-province', provinceId);
  }

  onIncident(callback: (incident: any) => void): void {
    this.socket?.on('traffic-incident', callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Singleton instance
let wsInstance: TrafficWebSocket | null = null;

export const getWebSocketInstance = (): TrafficWebSocket => {
  if (!wsInstance) {
    wsInstance = new TrafficWebSocket();
  }
  return wsInstance;
};
