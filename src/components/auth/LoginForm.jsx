import React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useAppContext } from '../../contexts/AppContext';

const LoginForm = () => {
  const { 
    loginCredentials, 
    handleLoginInput, 
    handleLogin 
  } = useAppContext();
  
  return (
    <form onSubmit={handleLogin} className="login-form">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={loginCredentials.email}
          onChange={handleLoginInput}
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={loginCredentials.password}
          onChange={handleLoginInput}
          placeholder="••••••••"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="accountType">Account Type</Label>
        <select
          id="accountType"
          name="accountType"
          value={loginCredentials.accountType}
          onChange={handleLoginInput}
          className="account-type-select"
        >
          <option value="creator">Creator</option>
          <option value="agency">Agency</option>
        </select>
      </div>
      
      <Button type="submit" className="login-button">Sign In</Button>
    </form>
  );
};

export default LoginForm;