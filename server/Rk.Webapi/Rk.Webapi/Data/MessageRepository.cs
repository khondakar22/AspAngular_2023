﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Helpers;
using Rk.Webapi.Interfaces;

namespace Rk.Webapi.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();
            query = messageParams.Container switch
            {
                "Inbox" => query.Where(
                    x => x.RecipientUsername == messageParams.Username && x.RecipientDeleted == false),
                "Outbox" => query.Where(x => x.SenderUsername == messageParams.Username && x.SenderDeleted == false),
                _ => query.Where(x =>
                    x.RecipientUsername == messageParams.Username && x.RecipientDeleted == false && x.DateRead == null)
            };
            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await _context.Messages.Include(x => x.Sender)
                .ThenInclude(x => x.Photos)
                .Include(x => x.Recipient)
                .ThenInclude(x => x.Photos)
                .Where(x => x.RecipientUsername == currentUsername && x.RecipientDeleted == false && x.SenderUsername == recipientUsername
                            || x.RecipientUsername == recipientUsername && x.SenderDeleted == false  && x.SenderUsername == currentUsername)
                .OrderBy(x => x.MessageSent)
                .ToListAsync();
            var unreadMessages = messages.Where(x => x.DateRead == null
                                                     && x.RecipientUsername == currentUsername).ToList();
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public void RemoveConnection(Connection connection)
        {
          _context.Connections.Remove(connection);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups.Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }
    }
}
