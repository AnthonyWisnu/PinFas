export const initialState = {
  currentUser: null,
  currentCitizen: null,
  authLoading: true,
  citizenAuthLoading: true,
  konfigurasi: null,
}

export function appReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH_USER':
      return { ...state, currentUser: action.payload, authLoading: false }
    case 'CLEAR_AUTH_USER':
      return { ...state, currentUser: null, authLoading: false }
    case 'SET_CITIZEN_USER':
      return { ...state, currentCitizen: action.payload, citizenAuthLoading: false }
    case 'CLEAR_CITIZEN_USER':
      return { ...state, currentCitizen: null, citizenAuthLoading: false }
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload }
    case 'SET_CITIZEN_AUTH_LOADING':
      return { ...state, citizenAuthLoading: action.payload }
    case 'SET_KONFIGURASI':
      return { ...state, konfigurasi: action.payload }
    default:
      return state
  }
}
