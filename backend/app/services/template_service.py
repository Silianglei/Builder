import os
import json
from typing import Dict, List, Tuple, Any
from pathlib import Path


class TemplateService:
    """Service for handling template file operations"""
    
    def __init__(self):
        self.template_base_path = Path(__file__).parent.parent.parent / "templates" / "nextjs-supabase"
    
    def get_all_template_files(self) -> List[Tuple[str, str, bool]]:
        """
        Get all template files with their relative paths and content.
        Returns: List of tuples (relative_path, content, is_binary)
        """
        files = []
        
        for root, dirs, filenames in os.walk(self.template_base_path):
            # Skip node_modules and .git directories
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git']]
            
            for filename in filenames:
                file_path = Path(root) / filename
                relative_path = str(file_path.relative_to(self.template_base_path))
                
                # Determine if file is binary
                binary_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf'}
                is_binary = any(filename.endswith(ext) for ext in binary_extensions)
                
                try:
                    if is_binary:
                        with open(file_path, 'rb') as f:
                            content = f.read()
                    else:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                    
                    files.append((relative_path, content, is_binary))
                except Exception as e:
                    print(f"Error reading file {relative_path}: {e}")
                    continue
        
        return files
    
    def replace_template_variables(self, content: str, variables: Dict[str, str]) -> str:
        """Replace template variables in content"""
        if isinstance(content, bytes):
            return content
            
        for key, value in variables.items():
            placeholder = f"{{{{{key}}}}}"
            content = content.replace(placeholder, value)
        
        return content
    
    def prepare_template_files(self, project_config: Dict[str, Any]) -> List[Tuple[str, Any, bool]]:
        """
        Prepare all template files with variables replaced.
        Returns: List of tuples (path, content, is_binary)
        """
        # Define template variables
        variables = {
            "PROJECT_NAME": project_config.get("name", "my-app"),
            "PROJECT_DESCRIPTION": project_config.get("description", "A Next.js app with Supabase"),
            "GITHUB_USERNAME": project_config.get("github_username", ""),
            "GITHUB_REPO_URL": project_config.get("repo_url", ""),
            "SUPABASE_URL": project_config.get("supabase_url", "your_supabase_url"),
            "SUPABASE_ANON_KEY": project_config.get("supabase_anon_key", "your_supabase_anon_key"),
            "SUPABASE_SERVICE_ROLE_KEY": project_config.get("supabase_service_key", "your_supabase_service_key"),
            "SUPABASE_PROJECT_ID": project_config.get("supabase_project_id", "your_project_id"),
        }
        
        # Get all template files
        template_files = self.get_all_template_files()
        
        # Process each file
        processed_files = []
        for relative_path, content, is_binary in template_files:
            # Special handling for .env.local.template
            if relative_path == ".env.local.template":
                # Rename to .env.local
                relative_path = ".env.local"
            
            # Replace variables in non-binary files
            if not is_binary:
                content = self.replace_template_variables(content, variables)
            
            processed_files.append((relative_path, content, is_binary))
        
        return processed_files
    
    def get_file_tree_structure(self) -> str:
        """Generate a tree structure of the template for documentation"""
        tree_lines = []
        
        def add_directory_to_tree(path: Path, prefix: str = "", is_last: bool = True):
            entries = sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name))
            
            for i, entry in enumerate(entries):
                is_last_entry = i == len(entries) - 1
                
                # Skip certain directories and files
                if entry.name in ['node_modules', '.git', '__pycache__']:
                    continue
                
                # Determine the branch character
                branch = "└── " if is_last_entry else "├── "
                tree_lines.append(f"{prefix}{branch}{entry.name}")
                
                # Recursively process directories
                if entry.is_dir():
                    extension = "    " if is_last_entry else "│   "
                    add_directory_to_tree(entry, prefix + extension, is_last_entry)
        
        add_directory_to_tree(self.template_base_path)
        return "\n".join(tree_lines)


# Initialize a singleton instance
template_service = TemplateService()