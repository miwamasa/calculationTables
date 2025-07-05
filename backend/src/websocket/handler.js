const socketIO = require('socket.io');

class WebSocketHandler {
  constructor(server, cellService, formulaEngine) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    
    this.cellService = cellService;
    this.formulaEngine = formulaEngine;
    
    this.setupHandlers();
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('join:table', (tableId) => {
        socket.join(`table:${tableId}`);
      });
      
      socket.on('cell:update', async (data) => {
        try {
          const { tableId, cellId, value } = data;
          
          // セルを更新
          const updatedCell = await this.cellService.updateCell(tableId, cellId, value);
          
          // 影響を受けるセルを再計算
          const affectedCells = await this.cellService.recalculateAffectedCells(cellId);
          
          // 全クライアントに更新を通知
          this.io.to(`table:${tableId}`).emit('cells:updated', {
            tableId,
            updates: [updatedCell, ...affectedCells]
          });
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
}

module.exports = WebSocketHandler;