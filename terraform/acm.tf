data "aws_acm_certificate" "pirates_csg_certificate" {
  domain      = "*.piratescsg.net"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

