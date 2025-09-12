/**
 * AppSyncBot - Cross-Platform State Management and Synchronization
 * Manages consistency between web app and mobile app
 */

class AppSyncBot {
  constructor() {
    this.name = 'AppSyncBot';
    this.version = '1.0.0';
    this.status = 'active';
    this.baseUrl = 'https://api.fitgenius.com'; // Replace with actual API endpoint
    this.localStorageKey = 'fitgenius_sync_data';
  }

  /**
   * Sync user preferences between platforms
   */
  async syncUserPreferences(preferences) {
    try {
      // Store locally first
      await this.storeLocally('preferences', preferences);
      
      // Attempt to sync with server
      if (this.isOnline()) {
        await this.sendToServer('/sync/preferences', preferences);
      }
      
      // Update web app if running in browser
      if (typeof window !== 'undefined') {
        this.updateWebApp('preferences', preferences);
      }
      
      console.log('✅ AppSyncBot: Preferences synced successfully');
    } catch (error) {
      console.error('❌ AppSyncBot: Failed to sync preferences:', error);
    }
  }

  /**
   * Sync pricing data between platforms
   */
  async syncPricingData(pricingData) {
    try {
      // Store locally with timestamp
      const syncData = {
        data: pricingData,
        timestamp: new Date().toISOString(),
        source: 'mobile'
      };
      
      await this.storeLocally('pricing', syncData);
      
      // Sync with server
      if (this.isOnline()) {
        await this.sendToServer('/sync/pricing', syncData);
      }
      
      console.log('✅ AppSyncBot: Pricing data synced successfully');
    } catch (error) {
      console.error('❌ AppSyncBot: Failed to sync pricing data:', error);
    }
  }

  /**
   * Sync inventory and purchase history
   */
  async syncInventory(inventory, purchaseHistory) {
    try {
      const syncData = {
        inventory,
        purchaseHistory,
        timestamp: new Date().toISOString(),
        source: 'mobile'
      };
      
      await this.storeLocally('inventory', syncData);
      
      if (this.isOnline()) {
        await this.sendToServer('/sync/inventory', syncData);
      }
      
      // Notify web app
      this.updateWebApp('inventory', syncData);
      
      console.log('✅ AppSyncBot: Inventory synced successfully');
    } catch (error) {
      console.error('❌ AppSyncBot: Failed to sync inventory:', error);
    }
  }

  /**
   * Sync weekly meal plans between platforms
   */
  async syncMealPlans(mealPlans, currentWeek) {
    try {
      const syncData = {
        mealPlans,
        currentWeek,
        timestamp: new Date().toISOString(),
        source: 'mobile'
      };
      
      await this.storeLocally('mealPlans', syncData);
      
      if (this.isOnline()) {
        await this.sendToServer('/sync/mealplans', syncData);
      }
      
      console.log('✅ AppSyncBot: Meal plans synced successfully');
    } catch (error) {
      console.error('❌ AppSyncBot: Failed to sync meal plans:', error);
    }
  }

  /**
   * Sync grocery list state
   */
  async syncGroceryList(groceryList, checkedItems, currentWeek) {
    try {
      const syncData = {
        groceryList,
        checkedItems: Array.from(checkedItems), // Convert Set to Array for JSON
        currentWeek,
        timestamp: new Date().toISOString(),
        source: 'mobile'
      };
      
      await this.storeLocally('groceryList', syncData);
      
      if (this.isOnline()) {
        await this.sendToServer('/sync/grocerylist', syncData);
      }
      
      // Update web app state
      this.updateWebApp('groceryList', syncData);
      
      console.log('✅ AppSyncBot: Grocery list synced successfully');
    } catch (error) {
      console.error('❌ AppSyncBot: Failed to sync grocery list:', error);
    }
  }

  /**
   * Get synced data from server or local storage
   */
  async getSyncedData(dataType) {
    try {
      // Try to get from server first
      if (this.isOnline()) {
        const serverData = await this.getFromServer(`/sync/${dataType}`);
        if (serverData) {
          await this.storeLocally(dataType, serverData);
          return serverData;
        }
      }
      
      // Fallback to local storage
      return await this.getFromLocal(dataType);
    } catch (error) {
      console.error(`❌ AppSyncBot: Failed to get synced ${dataType}:`, error);
      return null;
    }
  }

  /**
   * Resolve conflicts between mobile and web app data
   */
  async resolveConflicts(localData, serverData) {
    if (!localData || !serverData) {
      return serverData || localData;
    }
    
    // Use timestamp to determine the most recent version
    const localTime = new Date(localData.timestamp);
    const serverTime = new Date(serverData.timestamp);
    
    if (localTime > serverTime) {
      // Local data is newer, push to server
      await this.sendToServer('/sync/resolve', localData);
      return localData;
    } else {
      // Server data is newer, use it
      return serverData;
    }
  }

  /**
   * Store data locally (AsyncStorage for mobile, localStorage for web)
   */
  async storeLocally(key, data) {
    try {
      const syncData = JSON.stringify(data);
      
      // React Native AsyncStorage
      if (typeof AsyncStorage !== 'undefined') {
        const AsyncStorage = require('react-native').AsyncStorage;
        await AsyncStorage.setItem(`${this.localStorageKey}_${key}`, syncData);
      }
      // Web localStorage
      else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${this.localStorageKey}_${key}`, syncData);
      }
    } catch (error) {
      console.error('Failed to store data locally:', error);
    }
  }

  /**
   * Get data from local storage
   */
  async getFromLocal(key) {
    try {
      let data = null;
      
      // React Native AsyncStorage
      if (typeof AsyncStorage !== 'undefined') {
        const AsyncStorage = require('react-native').AsyncStorage;
        data = await AsyncStorage.getItem(`${this.localStorageKey}_${key}`);
      }
      // Web localStorage
      else if (typeof localStorage !== 'undefined') {
        data = localStorage.getItem(`${this.localStorageKey}_${key}`);
      }
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get data from local storage:', error);
      return null;
    }
  }

  /**
   * Send data to server API
   */
  async sendToServer(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-App-Version': this.version
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to send data to server:', error);
      throw error;
    }
  }

  /**
   * Get data from server API
   */
  async getFromServer(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-App-Version': this.version
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get data from server:', error);
      return null;
    }
  }

  /**
   * Update web app state if running in browser context
   */
  updateWebApp(dataType, data) {
    if (typeof window !== 'undefined' && window.postMessage) {
      // Send message to web app
      window.postMessage({
        type: 'FITGENIUS_SYNC',
        dataType,
        data,
        source: 'AppSyncBot',
        timestamp: new Date().toISOString()
      }, '*');
    }
  }

  /**
   * Check if device is online
   */
  isOnline() {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true; // Assume online if can't detect
  }

  /**
   * Get authentication token (implement based on your auth system)
   */
  getAuthToken() {
    // Implement based on your authentication system
    return 'demo_token_123';
  }

  /**
   * Initialize sync bot and set up event listeners
   */
  initialize() {
    console.log('🚀 AppSyncBot: Initialized successfully');
    
    // Listen for network status changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('📡 AppSyncBot: Connection restored, syncing data...');
        this.syncPendingData();
      });
      
      window.addEventListener('offline', () => {
        console.log('📴 AppSyncBot: Connection lost, switching to offline mode');
      });
    }
  }

  /**
   * Sync any pending data when connection is restored
   */
  async syncPendingData() {
    try {
      const pendingData = await this.getFromLocal('pending_sync');
      if (pendingData && pendingData.length > 0) {
        for (const item of pendingData) {
          await this.sendToServer(item.endpoint, item.data);
        }
        // Clear pending data after successful sync
        await this.storeLocally('pending_sync', []);
      }
    } catch (error) {
      console.error('Failed to sync pending data:', error);
    }
  }

  /**
   * Create a unified state object for both platforms
   */
  createUnifiedState(mobileState, webState = null) {
    return {
      peopleCount: mobileState.peopleCount || 1,
      userZipcode: mobileState.userZipcode || '',
      selectedStore: mobileState.selectedStore || '',
      currentWeek: mobileState.currentWeek || 0,
      inventory: mobileState.inventory || {},
      purchaseHistory: mobileState.purchaseHistory || {},
      checkedItems: Array.isArray(mobileState.checkedItems) 
        ? new Set(mobileState.checkedItems) 
        : mobileState.checkedItems || new Set(),
      groceryList: mobileState.groceryList || [],
      pricingData: mobileState.pricingData || null,
      lastSyncTime: new Date().toISOString(),
      platform: typeof window !== 'undefined' ? 'web' : 'mobile'
    };
  }

  /**
   * Export state for backup/restore
   */
  async exportState() {
    try {
      const state = {
        preferences: await this.getFromLocal('preferences'),
        inventory: await this.getFromLocal('inventory'),
        groceryList: await this.getFromLocal('groceryList'),
        mealPlans: await this.getFromLocal('mealPlans'),
        pricing: await this.getFromLocal('pricing'),
        exportDate: new Date().toISOString(),
        version: this.version
      };
      
      return JSON.stringify(state, null, 2);
    } catch (error) {
      console.error('Failed to export state:', error);
      return null;
    }
  }

  /**
   * Import state from backup
   */
  async importState(stateJson) {
    try {
      const state = JSON.parse(stateJson);
      
      if (state.preferences) await this.storeLocally('preferences', state.preferences);
      if (state.inventory) await this.storeLocally('inventory', state.inventory);
      if (state.groceryList) await this.storeLocally('groceryList', state.groceryList);
      if (state.mealPlans) await this.storeLocally('mealPlans', state.mealPlans);
      if (state.pricing) await this.storeLocally('pricing', state.pricing);
      
      console.log('✅ AppSyncBot: State imported successfully');
      return true;
    } catch (error) {
      console.error('❌ AppSyncBot: Failed to import state:', error);
      return false;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppSyncBot;
}

export default AppSyncBot;