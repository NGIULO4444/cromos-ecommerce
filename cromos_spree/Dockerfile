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
    curl \
    yaml-dev \
    libffi-dev \
    gcompat

# Copia Gemfile
COPY Gemfile Gemfile.lock ./

# Installa gems
RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install

# Copia applicazione
COPY . .

# Copia script di avvio
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Esponi porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando di avvio con entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
