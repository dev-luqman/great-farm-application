#!/bin/bash

# Define the AWS CLI profile
AWS_PROFILE="your-cli-profile"

# Define the AWS region
AWS_REGION="your-aws-region"

# Get the AWS account ID using the specified profile
echo "Fetching AWS account ID..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --profile $AWS_PROFILE --query Account --output text)
echo "AWS account ID: $AWS_ACCOUNT_ID"

# Define the file containing ECR repository names
REPOSITORY_FILE="ecr_repositories.txt"

# Authenticate Docker to ECR using the specified profile
echo "Authenticating Docker to ECR..."
aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo "Docker authenticated to ECR"

# Loop through each repository name and push the corresponding Docker image
echo "Pushing Docker images to ECR..."
while IFS= read -r repository; do
  echo "Building Docker image for repository: $repository"
  docker build -t $repository .
  
  echo "Tagging Docker image for repository: $repository"
  docker tag $repository $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repository
  
  echo "Pushing Docker image for repository: $repository"
  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repository
done < "$REPOSITORY_FILE"

echo "All Docker images pushed to ECR successfully"
