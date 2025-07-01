export interface DemoUser {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
}

class DemoAuthService {
  private currentUser: DemoUser | null = null
  private listeners: ((user: DemoUser | null) => void)[] = []

  constructor() {
    // Auto-login with demo user
    this.currentUser = {
      uid: "demo-user-123",
      displayName: "Demo Champion",
      email: "demo@aphrodite.gg",
      photoURL: null,
    }
  }

  onAuthStateChanged(callback: (user: DemoUser | null) => void) {
    this.listeners.push(callback)
    // Immediately call with current user
    callback(this.currentUser)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  async signIn(email: string, password: string): Promise<DemoUser> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.currentUser = {
      uid: "demo-user-123",
      displayName: "Demo Champion",
      email: email,
      photoURL: null,
    }

    this.notifyListeners()
    return this.currentUser
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    this.notifyListeners()
  }

  async updateProfile(updates: Partial<DemoUser>): Promise<void> {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates }
      this.notifyListeners()
    }
  }

  getCurrentUser(): DemoUser | null {
    return this.currentUser
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }
}

export const demoAuth = new DemoAuthService()
