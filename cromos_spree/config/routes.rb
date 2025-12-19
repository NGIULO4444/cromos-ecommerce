Rails.application.routes.draw do
  # Health check endpoint
  get '/health', to: proc { [200, {}, ['OK']] }
  
  # Spree routes
  mount Spree::Core::Engine, at: '/'
end
