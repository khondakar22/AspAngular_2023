﻿namespace Rk.Webapi.Dto
{
    public class PhotoDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
    }
}
