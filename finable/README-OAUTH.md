# Configuración de OAuth para Google y Microsoft

## Configuración de Google OAuth

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Gmail:
   - Ve a "APIs & Services" > "Library"
   - Busca "Gmail API" y habilítala

### 2. Configurar OAuth 2.0

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Selecciona "Web application"
4. Configura las URLs autorizadas:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Guarda el Client ID y Client Secret

### 3. Configurar scopes

Los scopes necesarios ya están configurados en el código:
- `openid email profile` - Información básica del usuario
- `https://www.googleapis.com/auth/gmail.readonly` - Lectura de correos de Gmail

## Configuración de Microsoft Azure AD

### 1. Registrar aplicación en Azure Portal

1. Ve a [Azure Portal](https://portal.azure.com/)
2. Ve a "Azure Active Directory" > "App registrations"
3. Haz clic en "New registration"
4. Completa la información:
   - Name: Tu nombre de aplicación
   - Supported account types: "Accounts in this organizational directory only" o "Accounts in any organizational directory"
   - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad` (Web)

### 2. Configurar permisos

1. Ve a "API permissions"
2. Haz clic en "Add a permission"
3. Selecciona "Microsoft Graph"
4. Selecciona "Delegated permissions"
5. Busca y agrega estos permisos:
   - `Mail.Read` - Leer correos del usuario
   - `Mail.ReadBasic` - Leer correos básicos
   - `User.Read` - Leer perfil del usuario
6. Haz clic en "Grant admin consent"

### 3. Obtener credenciales

1. Ve a "Certificates & secrets"
2. Crea un nuevo "Client secret"
3. Guarda el Client ID, Client Secret y Tenant ID

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-aqui

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Microsoft Azure AD OAuth
AZURE_AD_CLIENT_ID=tu-azure-client-id
AZURE_AD_CLIENT_SECRET=tu-azure-client-secret
AZURE_AD_TENANT_ID=tu-azure-tenant-id
```

## Uso

1. Ejecuta `pnpm dev` para iniciar el servidor
2. Ve a `http://localhost:3000/proveedores`
3. Haz clic en "Conectar con Google" o "Conectar con Microsoft"
4. Autoriza la aplicación
5. Una vez conectado, podrás leer correos usando los botones correspondientes

## APIs utilizadas

### Google Gmail API
- Endpoint: `https://gmail.googleapis.com/gmail/v1/users/me/messages`
- Permite leer correos, obtener detalles y metadatos

### Microsoft Graph API
- Endpoint: `https://graph.microsoft.com/v1.0/me/messages`
- Permite leer correos de Outlook/Exchange

## Notas importantes

- Los tokens de acceso se almacenan en la sesión de NextAuth
- Los permisos solicitados son de solo lectura para seguridad
- La aplicación maneja automáticamente la renovación de tokens
- Los correos se muestran con información básica (asunto, remitente, fecha, preview)
