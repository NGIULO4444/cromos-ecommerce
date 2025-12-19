FROM ruby:3.2-alpine

WORKDIR /app

# Installa dipendenze sistema
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    nodejs \
    yarn \
    git \
    imagemagick \
    vips-dev \
    curl

# Copia Gemfile
COPY Gemfile Gemfile.lock ./

# Installa gems
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install

# Copia applicazione
COPY . .

# Genera secret key e precompila assets
RUN SECRET_KEY_BASE=dummy RAILS_ENV=production bundle exec rails assets:precompile

# Esponi porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando di avvio
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
