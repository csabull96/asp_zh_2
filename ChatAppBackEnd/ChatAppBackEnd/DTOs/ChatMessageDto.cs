using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAppBackEnd.DTOs
{
    public class ChatMessageDto
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string ChatRoomId { get; set; }
        public string Username { get; set; }
        public string Created { get; set; }
    }
}
