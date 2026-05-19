onRemoveUser(userId: number): void {
  this.userService.remove(userId).subscribe({
    next: () => {
      this.loadUsers();
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error removing user:', err);
      // Podrías mostrar un mensaje en pantalla si quieres
    }
  });
}
