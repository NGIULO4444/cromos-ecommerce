/**
 * Cromos Email Templates Service
 * Gestione template email con Brevo/SendGrid
 */

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text?: string
}

export interface EmailData {
  to: string
  from?: string
  subject: string
  html?: string
  text?: string
  templateId?: string
  templateData?: Record<string, any>
}

export class EmailTemplatesService {
  private readonly templates: Map<string, EmailTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    // Template Ordine Creato
    this.templates.set('order_placed', {
      id: 'order_placed',
      name: 'Ordine Confermato',
      subject: 'Ordine #{order_number} confermato - Cromos',
      html: this.getOrderPlacedTemplate(),
      text: this.getOrderPlacedTextTemplate()
    })

    // Template Ordine Spedito
    this.templates.set('order_shipped', {
      id: 'order_shipped',
      name: 'Ordine Spedito',
      subject: 'Il tuo ordine #{order_number} è stato spedito - Cromos',
      html: this.getOrderShippedTemplate(),
      text: this.getOrderShippedTextTemplate()
    })

    // Template Reset Password
    this.templates.set('password_reset', {
      id: 'password_reset',
      name: 'Reset Password',
      subject: 'Reset della password - Cromos',
      html: this.getPasswordResetTemplate(),
      text: this.getPasswordResetTextTemplate()
    })

    // Template Benvenuto
    this.templates.set('welcome', {
      id: 'welcome',
      name: 'Benvenuto',
      subject: 'Benvenuto su Cromos!',
      html: this.getWelcomeTemplate(),
      text: this.getWelcomeTextTemplate()
    })

    // Template Carrello Abbandonato
    this.templates.set('abandoned_cart', {
      id: 'abandoned_cart',
      name: 'Carrello Abbandonato',
      subject: 'Hai dimenticato qualcosa nel tuo carrello - Cromos',
      html: this.getAbandonedCartTemplate(),
      text: this.getAbandonedCartTextTemplate()
    })
  }

  getTemplate(templateId: string): EmailTemplate | undefined {
    return this.templates.get(templateId)
  }

  getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values())
  }

  // Template HTML per ordine confermato
  private getOrderPlacedTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordine Confermato</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 18px; color: #3b82f6; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Ordine Confermato!</h1>
            <p>Grazie per il tuo acquisto su Cromos</p>
        </div>
        
        <div class="content">
            <h2>Ciao {{customer_first_name}},</h2>
            <p>Il tuo ordine <strong>#{{order_number}}</strong> è stato confermato con successo!</p>
            
            <div class="order-details">
                <h3>Dettagli Ordine</h3>
                <p><strong>Numero Ordine:</strong> #{{order_number}}</p>
                <p><strong>Data:</strong> {{order_date}}</p>
                <p><strong>Email:</strong> {{customer_email}}</p>
                
                <h4>Prodotti Ordinati:</h4>
                {{#each items}}
                <div class="item">
                    <strong>{{title}}</strong><br>
                    SKU: {{variant_sku}}<br>
                    Quantità: {{quantity}} × {{unit_price_formatted}}<br>
                    Subtotale: {{total_formatted}}
                </div>
                {{/each}}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #3b82f6;">
                    <p><strong>Subtotale:</strong> {{subtotal_formatted}}</p>
                    <p><strong>Spedizione:</strong> {{shipping_total_formatted}}</p>
                    <p><strong>IVA:</strong> {{tax_total_formatted}}</p>
                    <p class="total">Totale: {{total_formatted}}</p>
                </div>
            </div>
            
            <div class="order-details">
                <h3>Indirizzo di Spedizione</h3>
                <p>
                    {{shipping_address.first_name}} {{shipping_address.last_name}}<br>
                    {{shipping_address.address_1}}<br>
                    {{#if shipping_address.address_2}}{{shipping_address.address_2}}<br>{{/if}}
                    {{shipping_address.postal_code}} {{shipping_address.city}}<br>
                    {{shipping_address.country_code}}
                </p>
            </div>
            
            <p>Riceverai una email di conferma spedizione non appena il tuo ordine sarà in viaggio.</p>
            
            <div style="text-align: center;">
                <a href="{{order_tracking_url}}" class="button">Traccia il tuo Ordine</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Grazie per aver scelto Cromos!</p>
            <p>Per assistenza: <a href="mailto:support@cromos.com">support@cromos.com</a></p>
            <p>© 2024 Cromos. Tutti i diritti riservati.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  // Template testo per ordine confermato
  private getOrderPlacedTextTemplate(): string {
    return `
🎉 ORDINE CONFERMATO - CROMOS

Ciao {{customer_first_name}},

Il tuo ordine #{{order_number}} è stato confermato con successo!

DETTAGLI ORDINE:
- Numero Ordine: #{{order_number}}
- Data: {{order_date}}
- Email: {{customer_email}}

PRODOTTI ORDINATI:
{{#each items}}
- {{title}} (SKU: {{variant_sku}})
  Quantità: {{quantity}} × {{unit_price_formatted}} = {{total_formatted}}
{{/each}}

RIEPILOGO:
- Subtotale: {{subtotal_formatted}}
- Spedizione: {{shipping_total_formatted}}
- IVA: {{tax_total_formatted}}
- TOTALE: {{total_formatted}}

INDIRIZZO DI SPEDIZIONE:
{{shipping_address.first_name}} {{shipping_address.last_name}}
{{shipping_address.address_1}}
{{#if shipping_address.address_2}}{{shipping_address.address_2}}{{/if}}
{{shipping_address.postal_code}} {{shipping_address.city}}
{{shipping_address.country_code}}

Riceverai una email di conferma spedizione non appena il tuo ordine sarà in viaggio.

Traccia il tuo ordine: {{order_tracking_url}}

Grazie per aver scelto Cromos!

Per assistenza: support@cromos.com
© 2024 Cromos. Tutti i diritti riservati.
    `
  }

  // Template HTML per ordine spedito
  private getOrderShippedTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordine Spedito</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .shipping-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .tracking-box { background: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: white; color: #22c55e; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Il tuo ordine è in viaggio!</h1>
            <p>Ordine #{{order_number}} spedito</p>
        </div>
        
        <div class="content">
            <h2>Ciao {{customer_first_name}},</h2>
            <p>Ottime notizie! Il tuo ordine <strong>#{{order_number}}</strong> è stato spedito e sarà presto da te.</p>
            
            <div class="tracking-box">
                <h3>Codice di Tracciamento</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">{{tracking_number}}</p>
                <a href="{{tracking_url}}" class="button">Traccia la Spedizione</a>
            </div>
            
            <div class="shipping-info">
                <h3>Informazioni Spedizione</h3>
                <p><strong>Corriere:</strong> {{shipping_carrier}}</p>
                <p><strong>Servizio:</strong> {{shipping_method}}</p>
                <p><strong>Data Spedizione:</strong> {{shipped_date}}</p>
                <p><strong>Consegna Stimata:</strong> {{estimated_delivery}}</p>
                
                <h4>Indirizzo di Consegna:</h4>
                <p>
                    {{shipping_address.first_name}} {{shipping_address.last_name}}<br>
                    {{shipping_address.address_1}}<br>
                    {{#if shipping_address.address_2}}{{shipping_address.address_2}}<br>{{/if}}
                    {{shipping_address.postal_code}} {{shipping_address.city}}<br>
                    {{shipping_address.country_code}}
                </p>
            </div>
            
            <p><strong>Cosa succede ora?</strong></p>
            <ul>
                <li>Il tuo pacco è stato affidato al corriere</li>
                <li>Riceverai aggiornamenti via SMS/email durante il trasporto</li>
                <li>Assicurati che qualcuno sia presente all'indirizzo di consegna</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Grazie per aver scelto Cromos!</p>
            <p>Per assistenza: <a href="mailto:support@cromos.com">support@cromos.com</a></p>
            <p>© 2024 Cromos. Tutti i diritti riservati.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  // Template testo per ordine spedito
  private getOrderShippedTextTemplate(): string {
    return `
📦 IL TUO ORDINE È IN VIAGGIO! - CROMOS

Ciao {{customer_first_name}},

Ottime notizie! Il tuo ordine #{{order_number}} è stato spedito e sarà presto da te.

CODICE DI TRACCIAMENTO: {{tracking_number}}

INFORMAZIONI SPEDIZIONE:
- Corriere: {{shipping_carrier}}
- Servizio: {{shipping_method}}
- Data Spedizione: {{shipped_date}}
- Consegna Stimata: {{estimated_delivery}}

INDIRIZZO DI CONSEGNA:
{{shipping_address.first_name}} {{shipping_address.last_name}}
{{shipping_address.address_1}}
{{#if shipping_address.address_2}}{{shipping_address.address_2}}{{/if}}
{{shipping_address.postal_code}} {{shipping_address.city}}
{{shipping_address.country_code}}

COSA SUCCEDE ORA:
- Il tuo pacco è stato affidato al corriere
- Riceverai aggiornamenti via SMS/email durante il trasporto
- Assicurati che qualcuno sia presente all'indirizzo di consegna

Traccia la spedizione: {{tracking_url}}

Grazie per aver scelto Cromos!

Per assistenza: support@cromos.com
© 2024 Cromos. Tutti i diritti riservati.
    `
  }

  // Template HTML per reset password
  private getPasswordResetTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .reset-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Reset Password</h1>
            <p>Richiesta di reset password per il tuo account Cromos</p>
        </div>
        
        <div class="content">
            <h2>Ciao {{customer_first_name}},</h2>
            <p>Hai richiesto il reset della password per il tuo account Cromos associato all'email <strong>{{customer_email}}</strong>.</p>
            
            <div class="reset-box">
                <h3>Reimposta la tua Password</h3>
                <p>Clicca sul pulsante qui sotto per creare una nuova password:</p>
                <a href="{{reset_url}}" class="button">Reimposta Password</a>
                <p style="margin-top: 15px; font-size: 14px; color: #666;">
                    Questo link è valido per 24 ore
                </p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Se non hai richiesto questo reset, ignora questa email</li>
                    <li>Non condividere questo link con nessuno</li>
                    <li>Il link scadrà tra 24 ore per motivi di sicurezza</li>
                </ul>
            </div>
            
            <p>Se hai problemi con il link, copia e incolla questo URL nel tuo browser:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">
                {{reset_url}}
            </p>
        </div>
        
        <div class="footer">
            <p>Se non hai richiesto questo reset, contattaci immediatamente.</p>
            <p>Per assistenza: <a href="mailto:support@cromos.com">support@cromos.com</a></p>
            <p>© 2024 Cromos. Tutti i diritti riservati.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  // Template testo per reset password
  private getPasswordResetTextTemplate(): string {
    return `
🔐 RESET PASSWORD - CROMOS

Ciao {{customer_first_name}},

Hai richiesto il reset della password per il tuo account Cromos associato all'email {{customer_email}}.

REIMPOSTA LA TUA PASSWORD:
Clicca su questo link per creare una nuova password:
{{reset_url}}

⚠️ IMPORTANTE:
- Se non hai richiesto questo reset, ignora questa email
- Non condividere questo link con nessuno
- Il link scadrà tra 24 ore per motivi di sicurezza

Se non hai richiesto questo reset, contattaci immediatamente.

Per assistenza: support@cromos.com
© 2024 Cromos. Tutti i diritti riservati.
    `
  }

  // Template HTML di benvenuto
  private getWelcomeTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuto su Cromos</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .welcome-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .features { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; }
        .feature { background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; text-align: center; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Benvenuto su Cromos!</h1>
            <p>Il tuo negozio di accessori telefonia di fiducia</p>
        </div>
        
        <div class="content">
            <h2>Ciao {{customer_first_name}},</h2>
            <p>Benvenuto nella famiglia Cromos! Siamo entusiasti di averti con noi.</p>
            
            <div class="welcome-box">
                <h3>Il tuo account è stato creato con successo!</h3>
                <p><strong>Email:</strong> {{customer_email}}</p>
                <p>Ora puoi accedere a tutte le funzionalità del nostro store e goderti un'esperienza di shopping personalizzata.</p>
            </div>
            
            <div class="features">
                <div class="feature">
                    <h4>📱 Vasta Selezione</h4>
                    <p>Cover, pellicole, caricatori per tutti i modelli di smartphone</p>
                </div>
                <div class="feature">
                    <h4>🚚 Spedizione Veloce</h4>
                    <p>Spedizione gratuita sopra i 29€ e consegna in 24-48h</p>
                </div>
                <div class="feature">
                    <h4>🛡️ Garanzia Qualità</h4>
                    <p>Prodotti di alta qualità con garanzia soddisfatti o rimborsati</p>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{shop_url}}" class="button">Inizia a Fare Shopping</a>
            </div>
            
            <div class="welcome-box">
                <h3>🎁 Offerta di Benvenuto</h3>
                <p>Come nuovo cliente, ricevi il <strong>10% di sconto</strong> sul tuo primo ordine!</p>
                <p>Usa il codice: <strong style="background: #fef3c7; padding: 5px 10px; border-radius: 4px;">BENVENUTO10</strong></p>
                <p style="font-size: 14px; color: #666;">*Valido per 30 giorni, ordine minimo 20€</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Seguici sui social per offerte esclusive e novità!</p>
            <p>Per assistenza: <a href="mailto:support@cromos.com">support@cromos.com</a></p>
            <p>© 2024 Cromos. Tutti i diritti riservati.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  // Template testo di benvenuto
  private getWelcomeTextTemplate(): string {
    return `
🎉 BENVENUTO SU CROMOS!

Ciao {{customer_first_name}},

Benvenuto nella famiglia Cromos! Siamo entusiasti di averti con noi.

IL TUO ACCOUNT È STATO CREATO CON SUCCESSO!
Email: {{customer_email}}

Ora puoi accedere a tutte le funzionalità del nostro store e goderti un'esperienza di shopping personalizzata.

PERCHÉ SCEGLIERE CROMOS:
📱 Vasta Selezione - Cover, pellicole, caricatori per tutti i modelli
🚚 Spedizione Veloce - Gratuita sopra i 29€, consegna in 24-48h
🛡️ Garanzia Qualità - Prodotti di alta qualità, soddisfatti o rimborsati

🎁 OFFERTA DI BENVENUTO
Come nuovo cliente, ricevi il 10% di sconto sul tuo primo ordine!
Usa il codice: BENVENUTO10
*Valido per 30 giorni, ordine minimo 20€

Inizia a fare shopping: {{shop_url}}

Seguici sui social per offerte esclusive e novità!

Per assistenza: support@cromos.com
© 2024 Cromos. Tutti i diritti riservati.
    `
  }

  // Template HTML carrello abbandonato
  private getAbandonedCartTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hai dimenticato qualcosa</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .cart-items { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; align-items: center; }
        .item:last-child { border-bottom: none; }
        .item img { width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .discount-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 15px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 Hai dimenticato qualcosa!</h1>
            <p>I tuoi prodotti ti stanno aspettando</p>
        </div>
        
        <div class="content">
            <h2>Ciao {{customer_first_name}},</h2>
            <p>Abbiamo notato che hai lasciato alcuni fantastici prodotti nel tuo carrello. Non perdere l'occasione di averli!</p>
            
            <div class="cart-items">
                <h3>I tuoi prodotti salvati:</h3>
                {{#each cart_items}}
                <div class="item">
                    <img src="{{thumbnail}}" alt="{{title}}">
                    <div>
                        <strong>{{title}}</strong><br>
                        <span style="color: #666;">{{variant_title}}</span><br>
                        <span style="color: #f59e0b; font-weight: bold;">{{unit_price_formatted}}</span>
                    </div>
                </div>
                {{/each}}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #f59e0b; text-align: right;">
                    <p style="font-size: 18px; font-weight: bold; color: #f59e0b;">
                        Totale: {{cart_total_formatted}}
                    </p>
                </div>
            </div>
            
            <div class="discount-box">
                <h3>🎁 Offerta Speciale per Te!</h3>
                <p>Completa il tuo ordine ora e ricevi il <strong>5% di sconto</strong></p>
                <p>Codice: <strong>RECUPERA5</strong></p>
                <p style="font-size: 12px; color: #666;">*Valido per 48 ore</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{cart_recovery_url}}" class="button">Completa il tuo Ordine</a>
            </div>
            
            <p><strong>Perché scegliere Cromos?</strong></p>
            <ul>
                <li>✅ Spedizione gratuita sopra i 29€</li>
                <li>✅ Consegna in 24-48 ore</li>
                <li>✅ Reso gratuito entro 30 giorni</li>
                <li>✅ Assistenza clienti dedicata</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Non vuoi più ricevere questi promemoria? <a href="{{unsubscribe_url}}">Disiscriviti</a></p>
            <p>Per assistenza: <a href="mailto:support@cromos.com">support@cromos.com</a></p>
            <p>© 2024 Cromos. Tutti i diritti riservati.</p>
        </div>
    </div>
</body>
</html>
    `
  }

  // Template testo carrello abbandonato
  private getAbandonedCartTextTemplate(): string {
    return `
🛒 HAI DIMENTICATO QUALCOSA! - CROMOS

Ciao {{customer_first_name}},

Abbiamo notato che hai lasciato alcuni fantastici prodotti nel tuo carrello. Non perdere l'occasione di averli!

I TUOI PRODOTTI SALVATI:
{{#each cart_items}}
- {{title}} ({{variant_title}})
  Prezzo: {{unit_price_formatted}}
{{/each}}

TOTALE: {{cart_total_formatted}}

🎁 OFFERTA SPECIALE PER TE!
Completa il tuo ordine ora e ricevi il 5% di sconto
Codice: RECUPERA5
*Valido per 48 ore

PERCHÉ SCEGLIERE CROMOS:
✅ Spedizione gratuita sopra i 29€
✅ Consegna in 24-48 ore
✅ Reso gratuito entro 30 giorni
✅ Assistenza clienti dedicata

Completa il tuo ordine: {{cart_recovery_url}}

Non vuoi più ricevere questi promemoria? {{unsubscribe_url}}

Per assistenza: support@cromos.com
© 2024 Cromos. Tutti i diritti riservati.
    `
  }
}

export default EmailTemplatesService
