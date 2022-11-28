locals {
  origin_id = "S3-${aws_s3_bucket.www_piratescsg_net_bucket.id}"
}

resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "default"
  description                       = "Default policy"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "pirates_csg_frontend_distribution" {
  origin {
    domain_name              = aws_s3_bucket.www_piratescsg_net_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = local.origin_id
  }

  enabled             = true
  default_root_object = "index.html"

  aliases = [local.url, "piratescsg.net"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "blacklist"
      locations        = ["IN"]
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    acm_certificate_arn            = data.aws_acm_certificate.pirates_csg_certificate.arn
  }
}

