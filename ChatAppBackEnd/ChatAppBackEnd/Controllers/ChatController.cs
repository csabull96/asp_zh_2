using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatAppBackEnd.Data;
using ChatAppBackEnd.DTOs;
using ChatAppBackEnd.Hubs;
using ChatAppBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ChatController : ControllerBase
    {
        AppDbContext _db;
        IHubContext<ChatAppHub> _hub;

        public ChatController(AppDbContext db, IHubContext<ChatAppHub> hub)
        {
            _db = db;
            _hub = hub;
        }



        [HttpPost]
        public async Task<ChatRoomDto> AddChatRoom([FromBody] ChatRoomDto chatRoom)
        {
            chatRoom.Id = Guid.NewGuid().ToString();
            var room = new ChatRoom
            {
                Id = chatRoom.Id,
                Name = chatRoom.Name,
                Created = DateTime.Now
            };

            _db.ChatRooms.Add(room);
            _db.SaveChanges();

            await _hub.Clients.All.SendAsync("NewChatRoom", chatRoom);

            return chatRoom;
        }

        [HttpGet]
        public IEnumerable<ChatRoomDto> ListChatRooms()
        {
            return _db.ChatRooms.ToList()
                .OrderByDescending(room => room.Created)
                .Select(room =>
            {
                ChatRoomDto dto = new ChatRoomDto();
                dto.Id = room.Id;
                dto.Name = room.Name;
                return dto;
            });
        }

        [HttpGet("{uid}")]
        public ChatRoom ListChatRooms(string uid)
        {
            return _db.ChatRooms.FirstOrDefault(chatRoom => chatRoom.Id == uid);
        }

        [HttpPost("add-message")]
        public async Task<ChatMessageDto> AddChatMessage([FromBody] ChatMessageDto chatMessageDto)
        {
            ChatRoom room = _db.ChatRooms.FirstOrDefault(room => room.Id == chatMessageDto.ChatRoomId);
            var message = new ChatMessage()
            {
                Id = Guid.NewGuid().ToString(),
                Text = chatMessageDto.Text,
                ChatRoom = room,
                Username = chatMessageDto.Username,
                Created = DateTime.Now
            };
            room.Messages.Add(message);

            _db.Update(room);
            _db.SaveChanges();


            chatMessageDto.Id = message.Id;
            chatMessageDto.Created = message.Created.ToString("yyyy.MM.dd. HH.mm.ss");
            await _hub.Clients.All.SendAsync("NewChatMessage", chatMessageDto);
            return chatMessageDto;
        }

        [HttpGet("room/{uid}")]
        public IEnumerable<ChatMessageDto> ListChatMessages(string uid)
        {
            return _db.ChatRooms.FirstOrDefault(room => room.Id == uid).Messages
                .OrderByDescending(msg => msg.Created)
                .Select(message =>
            {
                ChatMessageDto dto = new ChatMessageDto();
                dto.Id = message.Id;
                dto.Text = message.Text;
                dto.ChatRoomId = uid;
                dto.Username = message.Username;
                dto.Created = message.Created.ToString("yyyy.MM.dd. HH:mm:ss");
                return dto;
            });
        }
    }
}
