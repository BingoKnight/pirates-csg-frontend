resource "aws_s3_bucket" "www_piratescsg_net_bucket" {
    bucket = local.url
    tags   = var.api_tags
}

resource "aws_s3_bucket_acl" "pirates_csg_frontend_bucket_acl" {
    bucket = aws_s3_bucket.www_piratescsg_net_bucket.id
    acl    = "public-read"
}

resource "aws_s3_bucket_policy" "pirates_csg_frontend_bucket_policy" {
    bucket = aws_s3_bucket.www_piratescsg_net_bucket.id
    policy = jsonencode(
        {
            Statement = [
                {
                    Sid       = "PublicReadGetObject"
                    Effect    = "Allow"
                    Action    = "s3:*"
                    Principal = "*"
                    Action    = "s3:GetObject"
                    Resource  = "arn:aws:s3:::${aws_s3_bucket.www_piratescsg_net_bucket.id}/*"
                },
            ]
            Version = "2012-10-17"
        }
    )
}

