from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from app.services.linkedin_service import LinkedInService
import os

router = APIRouter()
linkedin_service = LinkedInService()

@router.get("/login")
async def login():
    """
    Redirect to LinkedIn OAuth login page
    """
    auth_url = linkedin_service.authentication.authorization_url
    return RedirectResponse(url=auth_url)

@router.get("/callback")
async def callback(request: Request):
    """
    Handle LinkedIn OAuth callback
    """
    try:
        # Get the authorization code from the callback
        code = request.query_params.get('code')
        if not code:
            raise HTTPException(status_code=400, detail="No authorization code provided")

        # Exchange the code for an access token
        access_token = linkedin_service.authentication.get_access_token(code)
        
        # Save the access token to .env file
        with open('.env', 'r') as f:
            env_content = f.read()
        
        # Update or add the access token
        if 'LINKEDIN_ACCESS_TOKEN=' in env_content:
            env_content = env_content.replace(
                'LINKEDIN_ACCESS_TOKEN=.*',
                f'LINKEDIN_ACCESS_TOKEN={access_token}'
            )
        else:
            env_content += f'\nLINKEDIN_ACCESS_TOKEN={access_token}'
        
        with open('.env', 'w') as f:
            f.write(env_content)

        return {"message": "Successfully authenticated with LinkedIn"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 