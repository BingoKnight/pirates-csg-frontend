variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_profile" {
  type    = string
  default = "pirates-csg-admin"
}

variable "api_tags" {
  default = {
    name = "pirates-csg-frontend"
  }
}

